/*
This declaration is needed because the demo uses the StatusWidget class. If you don’t need the StatusWidget nor other classes belonging to the so called Lightstreamer Client "full" library, you can delete this file and simplify the imports by writing, for instance,

  import { LightstreamerClient, Subscription } from 'lightstreamer-client-web’
  
For the difference among the Client libraries, see this page https://www.npmjs.com/package/lightstreamer-client-web.
*/
declare module 'lightstreamer-client-web/lightstreamer.esm' {
  export * from 'lightstreamer-client-web'
}