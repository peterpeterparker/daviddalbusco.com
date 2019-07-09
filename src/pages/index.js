import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import Header from "../components/header/header"
import Portfolio from "../components/portfolio/portfolio"
import Blog from "../components/blog/blog"
import About from "../components/about/about"
import Contact from "../components/contact/contact"

import { library, config } from "@fortawesome/fontawesome-svg-core"

import { faRobot } from "@fortawesome/pro-light-svg-icons"
import { faSuitcase } from "@fortawesome/pro-light-svg-icons"
import { faNewspaper } from "@fortawesome/pro-light-svg-icons"
import { faAddressCard } from "@fortawesome/pro-light-svg-icons"
import { faEnvelope } from "@fortawesome/pro-light-svg-icons"
import { faBars } from "@fortawesome/pro-light-svg-icons"
import { faChevronRight } from "@fortawesome/pro-light-svg-icons"
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons"
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons"
import { faBookSpells } from "@fortawesome/pro-light-svg-icons"

import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faMedium } from "@fortawesome/free-brands-svg-icons"
import { faDev } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons"

// https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

library.add(faRobot)
library.add(faSuitcase)
library.add(faNewspaper)
library.add(faAddressCard)
library.add(faEnvelope)
library.add(faBars)
library.add(faChevronRight)
library.add(faChevronLeft)
library.add(faInfoCircle)
library.add(faBookSpells)

library.add(faGithub)
library.add(faMedium)
library.add(faDev)
library.add(faTwitter)
library.add(faLinkedinIn)

class IndexPage extends React.Component {

    render() {
        return <Layout fixNav={false}>
            <SEO/>
            <Header/>
            <Portfolio/>
            <About/>
            <Blog/>
            <Contact/>
        </Layout>
    }
}

export default () => (
  <IndexPage/>
)

// IE9: https://stackoverflow.com/questions/5472938/does-ie9-support-console-log-and-is-it-a-real-function#answer-5473193
const log = Function.prototype.bind.call(console.log, console);
log.apply(console, ['%cDavid Dal Busco', 'color: #ff65a9;font-size:2rem;font-weight: 300;']);
log.apply(console, ['%cHey, interested in the code of this website? Lucky you, it is open source 😜', 'color: #2d294c;font-size:1rem;font-weight: 300;']);
log.apply(console, ['%cCome say hi on Github', 'color: #2d294c;font-size:1rem;font-weight: 300;']);
log.apply(console, ['%chttps://github.com/peterpeterparker/daviddalbusco.com', 'font-size:1rem;font-weight: 300;']);
