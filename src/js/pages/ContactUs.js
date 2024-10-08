import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/pages/ContactUs.css";

function ContactUs() {
  return (
      <div className="container text-center mt-5">

          <div className="mt-4">
              {/* Section explaining the company's commitment to support */}
              <h2 className="contact-header">Our Commitment</h2>
              <p className="lead">
                  At SMARTJ, we are committed to providing excellent support and
                  feedback. Our team is dedicated to helping you with any inquiries or
                  concerns you might have. Don't hesitate to get in touch, and we'll
                  respond as quickly as possible.
              </p>
          </div>

          <br />
          <hr />

          {/* Main heading for the contact page */}
          <h1 className="contact-header mt-5">Contact Us</h1>

          {/* Subheading and introductory text */}
          <p className="lead">
              We'd love to hear from you! Reach out with any questions or feedback.
          </p>

          <div className="mt-4">
              {/* Section for contact information */}
              <p className="lead">
                  You can email us directly at:{" "}
                  {/* Email link with styling for email address */}
                  <a href="mailto:team4smartj@gmail.com" className="text-primary">
                      team4smartj@gmail.com
                  </a>
              </p>
          </div>
      </div>
  );
}

export default ContactUs;
