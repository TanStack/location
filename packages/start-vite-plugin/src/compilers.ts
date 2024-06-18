import * as t from '@babel/types'

import type * as babel from '@babel/core'
import type { CompileAstFn } from './ast'

export async function createServerFnCompiler(opts: {
  code: string
  compile: CompileAstFn
  filename: string
}) {
  return await opts.compile({
    code: opts.code,
    filename: opts.filename,
    getBabelConfig: () => ({
      plugins: [
        [
          {
            visitor: {
              Program: {
                enter(programPath: babel.NodePath<t.Program>) {
                  let identifierType:
                    | 'ImportSpecifier'
                    | 'ImportNamespaceSpecifier' = 'ImportSpecifier'

                  let namespaceId = ''
                  let serverFnId = 'createServerFn'

                  programPath.traverse({
                    ImportDeclaration: (path) => {
                      if (path.node.source.value !== '@tanstack/start') {
                        return
                      }

                      path.node.specifiers.forEach((specifier) => {
                        // handles a destructured import being renamed like "import { createServerFn as myCreateServerFn } from '@tanstack/start';"
                        if (
                          specifier.type === 'ImportSpecifier' &&
                          specifier.imported.type === 'Identifier'
                        ) {
                          if (specifier.imported.name === 'createServerFn') {
                            serverFnId = specifier.local.name
                            identifierType = 'ImportSpecifier'
                          }
                        }

                        // handles a namespace import like "import * as TanStackStart from '@tanstack/start';"
                        if (specifier.type === 'ImportNamespaceSpecifier') {
                          identifierType = 'ImportNamespaceSpecifier'
                          namespaceId = specifier.local.name
                          serverFnId = `${namespaceId}.createServerFn`
                        }
                      })
                    },
                    CallExpression: (path) => {
                      const importSpecifierCondition =
                        path.node.callee.type === 'Identifier' &&
                        path.node.callee.name === serverFnId

                      const importNamespaceSpecifierCondition =
                        path.node.callee.type === 'MemberExpression' &&
                        path.node.callee.property.type === 'Identifier' &&
                        path.node.callee.property.name === 'createServerFn'

                      const createServerFnEntryCondition =
                        identifierType === 'ImportSpecifier'
                          ? importSpecifierCondition
                          : importNamespaceSpecifierCondition

                      if (createServerFnEntryCondition) {
                        // If the function at createServerFn(_, MyFunc) doesn't have a
                        // 'use server' directive at the top of the function scope,
                        // then add it.
                        const fn = path.node.arguments[1]

                        if (
                          t.isFunctionExpression(fn) ||
                          t.isArrowFunctionExpression(fn)
                        ) {
                          if (t.isBlockStatement(fn.body)) {
                            const hasUseServerDirective =
                              fn.body.directives.some((directive) => {
                                return directive.value.value === 'use server'
                              })

                            if (!hasUseServerDirective) {
                              fn.body.directives.unshift(
                                t.directive(t.directiveLiteral('use server')),
                              )
                            }
                          }
                        } else if (
                          t.isIdentifier(fn) ||
                          t.isCallExpression(fn)
                        ) {
                          // A function was passed to createServerFn in the form of an
                          // identifier or a call expression that returns a function.

                          // We wrap the identifier/call expression in a function
                          // expression that accepts the same arguments as the original
                          // function with the "use server" directive at the top of the
                          // function scope.

                          const args = t.restElement(t.identifier('args'))

                          // Annotate args with the type:
                          //  Parameters<Parameters<typeof createServerFn>[1]>

                          args.typeAnnotation = t.tsTypeAnnotation(
                            t.tsTypeReference(
                              t.identifier('Parameters'),
                              t.tsTypeParameterInstantiation([
                                t.tsIndexedAccessType(
                                  t.tsTypeReference(
                                    t.identifier('Parameters'),
                                    t.tsTypeParameterInstantiation([
                                      t.tsTypeQuery(t.identifier(serverFnId)),
                                    ]),
                                  ),
                                  t.tsLiteralType(t.numericLiteral(1)),
                                ),
                              ]),
                            ),
                          )

                          const wrappedFn = t.arrowFunctionExpression(
                            [args],
                            t.blockStatement(
                              [
                                t.returnStatement(
                                  t.callExpression(
                                    t.memberExpression(
                                      fn,
                                      t.identifier('apply'),
                                    ),
                                    [
                                      t.identifier('this'),
                                      t.identifier('args'),
                                    ],
                                  ),
                                ),
                              ],
                              [t.directive(t.directiveLiteral('use server'))],
                            ),
                          )

                          path.node.arguments[1] = wrappedFn
                        }
                      }
                    },
                  })
                },
              },
            },
          },
          {
            root: process.cwd(),
            minify: process.env.NODE_ENV === 'production',
          },
        ],
      ].filter(Boolean),
    }),
  })
}
