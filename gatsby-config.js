module.exports = {
  siteMetadata: {
    title: `David Dal Busco`,
    description: `Freelancer - Full Stack Development Web, PWA and Mobile iOS/Android - Project management - UX and IT consulting`,
    author: `David Dal Busco`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `daviddalbusco.com`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#221f39`,
        theme_color: `#221f39`,
        display: `minimal-ui`,
        icon: `src/images/daviddalbusco-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-sass`
  ],
}
