import * as React from 'react'
import { Banner } from 'components/Banner'
import { Sticky } from 'components/Sticky'
import { Nav } from 'components/Nav'
import { siteConfig } from 'siteConfig'
import Link from 'next/link'
import { Footer } from 'components/Footer'
import { Seo } from 'components/Seo'
import Head from 'next/head'
import { ParentSize } from '@visx/responsive'

const Home = (props) => {
  return (
    <>
      <Seo
        title="React Location"
        description="Enterprise routing for React applications"
      />
      <Head>
        <title>
          React Location - Enterprise routing for React applications
        </title>
      </Head>
      <div className="bg-gray-50 h-full min-h-full">
        <Banner />
        <Sticky>
          <Nav />
        </Sticky>
        <div
          style={{
            padding: '56.25% 0 0 0',
            position: 'relative',
          }}
        >
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/rLY65AQreSU"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          ></iframe>
        </div>
        <div className="relative bg-white overflow-hidden shadow-2xl">
          <div className="py-24 mx-auto container px-4 sm:mt-12  relative">
            <img
              src={require('images/emblem-light.svg')}
              className="absolute transform right-0 top-1/2 h-0 lg:h-full scale-150 translate-x-1/2 xl:translate-x-1/5 -translate-y-1/2"
              alt="React Location Emblem"
            />
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-6 ">
                <div className="text-center lg:text-left md:max-w-2xl md:mx-auto ">
                  <h1 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:leading-none sm:text-6xl lg:text-5xl xl:text-6xl">
                    Powerful, enterprise-grade routing for React applications
                  </h1>
                  <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Declarative & asynchronous route elements and data loaders,
                    first-class Search Param APIs, nested-routing,
                    code-splitting and so much more.
                  </p>

                  <div className="mt-5  mx-auto sm:flex sm:justify-center lg:justify-start lg:mx-0 md:mt-8">
                    <div className="rounded-md shadow">
                      <Link href="/overview">
                        <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-coral hover:bg-coral-light focus:outline-none focus:border-coral focus:shadow-outline-coral transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                          Get Started
                        </a>
                      </Link>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <a
                        href={siteConfig.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-coral bg-white hover:text-coral-light focus:outline-none focus:border-coral-light focus:shadow-outline-coral transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-lg border-t border-gray-200 bg-gray-50 ">
          <div className="py-24  ">
            <div className="mx-auto container">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <h3 className="text-xl leading-6 xl:text-2xl font-bold text-gray-900">
                    Table Stakes, but Without the Table
                  </h3>
                  <p className="mt-2 lg:mt-4 text-base xl:text-lg lg:leading-normal leading-6 text-gray-600">
                    While React Location pays serious homage to features that
                    users have come to expect from existing routers in the
                    ecosystem like React Router and Next.js, it's not wasting
                    any time by ignoring the complexities and challenges of
                    building client-side applications. React Location is
                    hyper-focused on providing mega-smooth routing experiences
                    that your users will immediately fall in love with.
                  </p>
                </div>
                <div className="mt-10 lg:mt-0">
                  <h3 className="text-xl leading-6 xl:text-2xl font-bold text-gray-900">
                    Asynchronous Routing, Prefetching & Caching
                  </h3>
                  <p className="mt-2  lg:mt-4 text-base xl:text-lg lg:leading-normal leading-6 text-gray-600">
                    Async routing has easily become the standard for full-stack
                    react frameworks but where traditional SPA routing is
                    falling behind, React Location packs a new modern punch.
                    SSR-style async routing is the out-of-the-box default
                    providing parallelized component-splitting and data-loading
                    with minimal effort.
                  </p>
                </div>
                <div className="mt-10 lg:mt-0">
                  <h3 className="text-xl leading-6 xl:text-2xl font-bold text-gray-900">
                    First-Class Search Params API
                  </h3>
                  <div className="mt-2  lg:mt-4 text-base xl:text-lg lg:leading-normal leading-6 text-gray-600">
                    Where most other routers provide minimum-to-no support for
                    intelligent URL search param management, React Location takes
                    them very seriously to provide highly integrated support for
                    matching, consuming, and manipulating URL search params at
                    scale.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="py-6">
            <div className="uppercase tracking-wider text-sm font-semibold text-center text-gray-400 mb-3">
              Trusted in Production by
            </div>

            <ClientsMarquee />
          </div> */}
        </div>
        <div className="relative text-lg border-t border-gray-200 bg-gray-100 overflow-hidden">
          <div className="lg:block lg:absolute lg:inset-0">
            <svg
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
              width="2400"
              height="2400"
              fill="none"
              viewBox="0 0 2400 2400"
            >
              <defs>
                <pattern
                  id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x="0"
                    y="0"
                    width="4"
                    height="4"
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                x="0"
                width="2400"
                height="2400"
                fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)"
              />
            </svg>
          </div>
          <div className="relative">
            <h3 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 lg:leading-none mt-8">
              Sponsors
            </h3>
            <div
              className="py-4 flex flex-wrap mx-auto"
              style={{ maxWidth: '95%' }}
            >
              <ParentSize>
                {({ width }) => {
                  return (
                    <iframe
                      title="sponsors"
                      src="https://tanstack.com/sponsors-embed"
                      style={{
                        width: width,
                        height: width,
                        overflow: 'hidden',
                      }}
                    />
                  )
                }}
              </ParentSize>
            </div>
            <div className="text-center mb-8">
              <a
                href="https://github.com/sponsors/tannerlinsley"
                className="inline-block bg-green-500 px-4 py-2 text-xl mx-auto leading-tight font-extrabold tracking-tight text-white rounded-full"
              >
                Become a Sponsor!
              </a>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 relative py-24 border-t border-gray-200 ">
          <div className="px-4 sm:px-6 lg:px-8  mx-auto container max-w-3xl sm:text-center">
            <h3 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 lg:leading-none mt-2">
              Try out the "Kitchen Sink" example below!
            </h3>
            <p className="my-4 text-xl leading-7  text-gray-600">
              Build your paths. Fetch your data. Command those URL Search
              params! Render your routes... asynchronously of course!
            </p>
          </div>
          <div
            style={{
              height: 224,
            }}
          />
        </div>

        <section className="bg-gray-900 body-font">
          <div className="container max-w-7xl px-4  mx-auto -mt-72 relative">
            <iframe
              src="https://codesandbox.io/embed/github/tannerlinsley/react-location/tree/main/examples/kitchen-sink?autoresize=1&fontsize=16&theme=dark"
              title="tannerlinsley/react-location: simple"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              className="shadow-2xl"
              style={{
                width: '100%',
                height: '80vh',
                border: '0',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'static',
                zIndex: 0,
              }}
            ></iframe>
          </div>
          <div className="py-24 px-4 sm:px-6 lg:px-8  mx-auto container">
            <div className=" sm:text-center pb-16">
              <h3 className="text-3xl mx-auto leading-tight font-extrabold tracking-tight text-white sm:text-4xl  lg:leading-none mt-2">
                A knob, toggle and function for everything!
              </h3>
              <p className="mt-4 text-xl max-w-3xl mx-auto leading-7 text-gray-300">
                As any great primitive utility would, React Location is designed
                to get out of your way when you need it to. Inversion of control
                is our name, and control is your game.
              </p>
            </div>
            <div>
              <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 text-white max-w-screen-lg mx-auto text-lg">
                {[
                  'Asynchronous Elements',
                  'Async Route Loaders',
                  'Code-Splitting',
                  'Nested/Layout Routes',
                  'Path Params',
                  '1st-Class Search Params API',
                  'Search Param Route Matching',
                  'Search Param Filters/Persistence',
                  'Search Param Compression + Stability',
                  'Default Elements',
                  'Error Boundary Elements',
                  'Pending Elements',
                  'Minimum Pending Duration',
                ].map((d) => {
                  return (
                    <a className="mb-2" key={d}>
                      <span className="bg-coral text-gray-800 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
                        <Check />
                      </span>
                      {d}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
        <div className="bg-gray-200 border-b border-gray-300">
          <div className="container mx-auto py-12 text-center">
            <h3 className="text-2xl md:text-5xl mx-auto leading-tight font-extrabold tracking-tight text-gray-800  lg:leading-none mt-2">
              Feeling Chatty?
            </h3>
            <a
              href="https://discord.gg/WrRKjPJ"
              target="_blank"
              className="inline-block bg-gray-800 p-5 text-2xl mx-auto leading-tight font-extrabold tracking-tight text-white mt-12 rounded-full"
            >
              Join the #TanStack Discord!
            </a>
          </div>
        </div>
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto py-24 px-4 flex flex-wrap md:flex-no-wrap items-center justify-between md:space-x-8">
            <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Wow, you've come a long way!
            </h2>
            <div className="mt-8 flex lg:flex-shrink-0 md:mt-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/overview">
                  <a className="inline-flex items-center justify-center text-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-coral hover:bg-coral-light focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                    Okay, let's get started!
                  </a>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a
                  href={siteConfig.repoUrl}
                  className="inline-flex items-center justify-center text-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-coral bg-white hover:text-coral-light focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                >
                  Take me to the GitHub repo.
                </a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <style jsx global>{`
          .gradient {
            -webkit-mask-image: linear-gradient(
              180deg,
              transparent 0,
              #000 30px,
              #000 calc(100% - 200px),
              transparent calc(100% - 100px)
            );
          }
        `}</style>
      </div>
    </>
  )
}

export default Home
Home.displayName = 'Home'
const Check = React.memo(() => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    className="w-3 h-3"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
))
