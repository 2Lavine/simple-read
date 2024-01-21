> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.patterns.dev](https://www.patterns.dev/vanilla/rendering-patterns)

# Rendering Patterns
- SSG
- ISR
- SSR,RSC
- Streaming SSR
- Edge rendering

Develop Experiences
--------------------------------
faster build times, easy rollbacks, scalable infrastructure
dynamic content, reliable uptime
Choosing a Pattern
------------------
While this can get overwhelming, it’s important to remember that every pattern was designed to address specific use cases. 
### Static Rendering
Static rendering is a simple yet powerful pattern you can use to build fast websites with nearly instant page loads.
- the entire page gets generated at build time and does not change till the next build. 
- The HTML content is static and easily cacheable on a CDN or an Edge network. 
	- CDNs can quickly serve the pre-rendered cached HTML to clients when they request a specific page. 

cuts down the time it would otherwise take to process the request, render HTML content and respond to a request in a typical server-side rendering set-up.

#### Static Rendering Suitable web
The process described above is most suitable for pages that do not change often and display the same data no matter who requests them. 
Since we consume a lot of dynamic, customized data on the web today, we have variations of static rendering to cater to different use cases.
- Plain static 
- Static with Client side
- Incremental Static regenration
- On demant Incremental Static regenration

![](_resources/img1.png)

### Basic/Plain Static Rendering
Since there are many variations of static rendering, let’s call the primary technique we discussed earlier Plain Static Rendering. You can use it for pages with little to no dynamic content.
When a user requests the page, the server sends the pre-generated HTML to the client. This response is also cached to the edge location closest to the user. The browser then renders the HTML and employs a JavaScript bundle to hydrate the page.

![](_resources/7.png)

Plain static rendering is excellent for performance because 
- it results in an extremely **quick TTFB** since HTML is already available on the server.
- The browser receives a faster response and can render it quickly, resulting in a **fast FCP and LCP**. 
- Since the content is static, there is **no layout shift** while rendering it.
### Static Rendering with Client-Side `fetch`
 Best for pages 
 - Contain data that should refresh on every load
 - contain stable placeholder components
The pre-generated HTML file is sent to the client when the user requests the page. The user initially sees the skeleton UI without any data. The client fetches the data from the API route, receives the response, and shows the listings. es the response and shows the listings. (the hydration call is not included in the example)

![](_resources/12.png)

While **Static Rendering with Client-Side** fetch gives us a **good TTFB and FCP**, the **LCP is sub-optimal** since “largest content” can only be displayed after we get the listings data from the API route.

disadvantage
- There is also a strong **possibility of layout shifts**, especially if the size of the skeleton UI doesn’t match the content rendered eventually.
- this approach could result in **higher server costs** since we call the API route once per page request.

### Static with `getStaticProps`
This method allows you to access the data provider and fetch data at build time on the server. It can be a good solution if you know that the dynamic data on a static page will always be available at build time.
![](_resources/15.png)

The `getStaticProps` method allows us to generate the HTML with the data on the server. Thus, we can avoid creating API routes to fetch the data on the client. Similarly, a skeleton component is not required while the data loads, as the page, will be rendered with the data.
When we build the project, the data provider is called, and the returned data is piped to the generated HTML.

When a user requests the page, the process is similar to plain static rendering. The response is cached and rendered to the screen, and the browser fetches the JavaScript bundles required to hydrate the page.

![](_resources/16.png)

From a client perspective, the network and main thread work are identical to plain static rendering, so we get a similarly **superior performance**.

Disadvantages
- As the site grows, the DX, when using this method, may not be so good.
	- **long build times**: For sites with hundreds of pages built statically(for example, blog sites), calling the `getStaticProps` method repeatedly can result in **long build times**. 
	- **large usage**:If you’re using an external API, you might hit the request limit or run a **large usage bill**.
- Only suitable only when we can get away with renewing data infrequently at build time. 
	- Frequent updates to data would mean often having to rebuild and redeploy the site.

### Incremental Static Regeneration
We can use incremental static regeneration to solve the build time, and dynamic data issues discussed earlier.

ISR is hybrid in the sense that it allows us
- to pre-render only certain static pages 
- render the dynamic pages on-demand when the user requests them. 
This results in shorter build times and allows automatic invalidation of the cache and regeneration of the page after a specific interval

Let’s assume we now want to show individual property details to enhance our previous demo. We can pre-render these new pages so that they load quickly when a user clicks on a listing.

Next.js helps us achieve this by using the getStaticPaths method to generate dynamic paths. We can tell Next.js which pages to pre-generate based on their query parameter.
For our demo, let’s fetch all listings and pre-generate the pages for each of them. 
Note that this would take very long if there were thousands of listings. In that case, we will have to tell Next to only pre-generate a subset of all the pages and render a fallback when the remaining listing pages are generated on-demand (when the user requests).

The pre-rendered and generated on-demand pages are delivered similarly. If a user requests a page that hasn’t been generated yet, it gets generated on-demand and cached by the Edge. Thus, only the first user is likely to have a poorer experience for pages that are not pre-rendered. Everyone else will benefit from the fast, cached response.
#### Automatically invalidate the cache and regenerate the page
This addresses the long build-time problem of the previous methods. But we still have the landing page, which needs to be redeployed every time we have a new listing.
To enable a refresh of the landing page, we can automatically invalidate the cache and regenerate the page in the background at a specific interval. We can use this by adding a revalidate field to the returned object.
If a user requests a page that has been in the cache for longer than the specified number of seconds, the user will initially see the stale page. The page regeneration is triggered simultaneously. Once the page is regenerated in the background, the cache is invalidated and updated with the recently regenerated page.
With Incremental Static Regeneration, we can show dynamic content by automatically revalidating the page every few seconds.

Disvantages
- Our content likely doesn’t update as often as the interval we have defined. This would result in unnecessary page regeneration and invalidation of the cache. 
- Each time this happens, we invoke our serverless functions, which could result in higher server costs.

### On-demand Incremental Static Regeneration

To solve the last drawback mentioned above we have **On-demand Incremental Static Regeneration** which allows us to use ISR, but the regeneration occurs on certain events rather than at fixed intervals.
Instead of using a `revalidate` field, we revalidate based on new data in API routes.

<video src="https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.24.13_PM_xeumhu.webm" control></video>

For example, we can listen to an incoming webhook event that tells us when new data has been added to our data provider. 
With regular ISR, the updated page is cached only at the edge nodes which have handled user requests for the page. On-demand ISR regenerates and redistributes the page across the edge network so that users worldwide will automatically see the most recent version of the page from the edge cache without seeing stale content. 
We also avoid unnecessary regenerations and serverless function calls, reducing operational costs compared to regular ISR.

### Server-Side Rendering
There are use cases where static isn’t the best option, for example, for highly dynamic, personalized pages that are different for every user. Let’s see what pattern works best for these.
With server-side rendering, we generate the HTML for every request. 
- This approach is most suitable for pages containing highly personalized data, for example, data based on the user cookie or generally any data obtained from the user’s request. 
- It’s also suitable for pages that should be render-blocking, perhaps based on authentication state.
- A personalized dashboard is an excellent example of highly dynamic content on a page. Most of the content is based on the user’s identity or authorization level that may be contained in a user cookie. 

Next.js allows us to render the page on the server using the `getServerSideProps` method. This method runs on the server for every request and eventually passes the returned data to the page to generate the HTML.
When a user requests the page, the `getServerSideProps` method runs, returns the data used to generate the page, and sends the response to the client. The client then renders this HTML and may send another request to fetch the JavaScript bundle that hydrates the elements.

The generated HTML content is unique to every request and should not be cached by the CDN.
![](_resources/31.png)

The network and main thread for the client are very similar for static and server-side rendering. The FCP is almost equal to the LCP, and we can easily avoid layout shifts as there is no dynamic content loading after the initial page load.

<video src="https://res.cloudinary.com/dq8xfyhu4/video/upload/l_logo_pke9dv,o_52,x_-1510,y_-900/ac_none/v1609691928/CS%20Visualized/Screen_Recording_2022-05-05_at_5.36.49_PM_kkuxv3.webm" control></video>

SSR Disvantage
- the TTFB for server-rendered pages is significantly longer than static rendering as the page gets generated from scratch at every request.
- server costs are likely to be high because you invoke serverless functions at every request.
- The time it takes to start up the lambda, known as the long cold boot, is a common issue with serverless functions. 

SSR optimization
1.  **Execution time of `getServerSideProps`**
    The page generation does not start until the data from `getServerSideProps` is available. Hence, we must ensure that the `getServerSideProps` method doesn’t run too long.
2.  **Deploy databases in the same region as your serverless function**
    If the data comes from a database, we must reduce the time taken to query the database. In addition to query optimization, you should also consider the location of the database.
3.  **Add `Cache-control` headers to responses**
    Another step to improve SSR performance is adding Cache-Control headers to the responses.


### Edge SSR + HTTP Streaming

Vercel is currently exploring **Edge Server-Side Rendering**, which will enable users to **server-render from all regions** and experience a **near-zero cold boot**. 
Another benefit of **Edge SSR** is that the edge runtime allows **HTTP streaming**.

With serverless functions, we generate the entire page server-side and wait for the whole bundle to be loaded and parsed on the client before hydration can begin.
With Edge SSR, we can stream parts of the document as soon as they’re ready and hydrate these components granularly. This reduces the waiting time for users as they can see components as they stream in one by one.

**Streaming SSR** also enables **React Server Components**. The combination of **Edge SSR with React Server Components** can allow us to have a beautiful **hybrid between static and server rendering**.

**React Server Components** allow us to partially render React components on the server, which is useful for components that require large dependencies that need not be downloaded to the client.

Going back to the real-estate website example, if we wanted to show the landing page again and include region-specific listings for the user. 
- The vast majority of the page only contains static data; it’s just the listings that require request-based data.
- Instead of having to server-render the entire page, we can now choose only to render the listings component server-side and the rest client-side. 
- Whereas we initially had to server-render the whole page to achieve this behavior, we can now get the **excellent performance of Static Rendering with the dynamic benefits of Server-Side Rendering**.

Conclusion
----------


![](_resources/Rendering-ComparisonTable.svg.png)

The following table from [Patterns for Building JavaScript Websites in 2022](https://dev.to/this-is-learning/patterns-for-building-javascript-websites-in-2022-5a93) offers another view pivoted by key application characteristics. It should be helpful for anyone looking for a suitable pattern for common [application holotypes](https://jasonformat.com/application-holotypes/).

<table><thead><tr><th></th><th>Portfolio</th><th>Content</th><th>Storefront</th><th>Social Network</th><th>Immersive</th></tr></thead><tbody><tr><th>Holotype</th><td>Personal Blog</td><td>CNN</td><td>Amazon</td><td>Facebook</td><td>Figma</td></tr><tr><th>Interactivity</th><td>Minimal</td><td>Linked Articles</td><td>Purchase</td><td>Multi-Point, Real-time</td><td>Everything</td></tr><tr><th>Session Depth</th><td>Shallow</td><td>Shallow</td><td>Shallow - Medium</td><td>Extended</td><td>Deep</td></tr><tr><th>Values</th><td>Simplicity</td><td>Discover-ability</td><td>Load Performance</td><td>Dynamicism</td><td>Immersiveness</td></tr><tr><th>Routing</th><td>Server</td><td>Server, Hybrid</td><td>Hybrid, Transitional</td><td>Transitional, Client</td><td>Client</td></tr><tr><th>Rendering</th><td>Static</td><td>Static, SSR</td><td>Static, SSR</td><td>SSR</td><td>CSR</td></tr><tr><th>Hydration</th><td>None</td><td>Progressive, Partial</td><td>Partial, Resumable</td><td>Any</td><td>None (CSR)</td></tr><tr><th>Example Framework</th><td>11ty</td><td>Astro, Elder</td><td>Marko, Qwik, Hydrogen</td><td>Next, Remix</td><td>Create React App</td></tr></tbody></table>