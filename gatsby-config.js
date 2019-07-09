module.exports = {
  siteMetadata: {
    title: `David Dal Busco`,
    description: `Freelancer - Full Stack Development Web, PWA and Mobile iOS/Android - Project management - UX and IT consulting`,
    author: `David Dal Busco`,
    url: "https://daviddalbusco.com",
    image: "/images/daviddalbusco.jpg",
    twitterUsername: "@daviddalbusco",
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
        short_name: `David`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2d294c`,
        display: `standalone`,
        icon: `src/images/daviddalbusco-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sass`
  ],
}
