import React from "react"

import "./footer.scss"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class Footer extends React.Component {

  render() {
    return <>
        <footer className="contact">
          <main className="small">
            <div className="address">
              <h2>Address</h2>
              <p>
                {`Fluster GmbH
c/o The Hub Zürich Association
Sihlquai 131
8005 Zürich`}
              </p>
            </div>

            <div className="web">
              <h2>On the web</h2>
              <a href="http://twitter.com/daviddalbusco/"><FontAwesomeIcon icon={["fab", "twitter"]} size="2x"/></a>
              <a href="https://www.linkedin.com/in/david-dal-busco/"><FontAwesomeIcon icon={["fab", "linkedin-in"]} size="2x"/></a>
              <a href="http://dev.to/daviddalbusco/"><FontAwesomeIcon icon={["fab", "dev"]} size="2x"/></a>
              <a href="https://medium.com/@david.dalbusco"><FontAwesomeIcon icon={["fab", "medium"]} size="2x"/></a>
              <a href="https://github.com/peterpeterparker"><FontAwesomeIcon icon={["fab", "github"]} size="2x"/></a>
            </div>
          </main>
        </footer>
        <footer className="opensource">
          <main className="small">
            <p>I've built this website. Its open source code is available on <a href="https://github.com/peterpeterparker/daviddalbusco.com">Github<FontAwesomeIcon icon={["fab", "github"]}/></a></p>
          </main>
        </footer>
      </>
  }
}


export default () => (
  <Footer/>
)
