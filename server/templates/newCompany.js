const Handlebars = require('handlebars');
const mjml2html = require('mjml');

const newCompanyTemplate = (context) => {
  const template = Handlebars.compile(`
  <mjml>
    <mj-head>
      <mj-title>Discount Light</mj-title>
      <mj-preview>Pre-header Text</mj-preview>
      <mj-attributes>
        <mj-all font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
        <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
      </mj-attributes>
      <mj-style inline="inline">
        .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); }
      </mj-style>
      <mj-style inline="inline">
        .text-link { color: #5e6ebf }
      </mj-style>
      <mj-style inline="inline">
        .footer-link { color: #888888 }
      </mj-style>
    </mj-head>
    <mj-body background-color="#E7E7E7" width="600px">
      <mj-section full-width="full-width" background-color="#391085" padding-bottom="0">
        <mj-column width="100%">
          <mj-image src="https://res.cloudinary.com/luismifeijoo/image/upload/v1586969036/emailTemplate_dknieq.png" width="600px" alt="" padding="0" />
        </mj-column>
      </mj-section>
      <mj-section background-color="#ffffff">
      </mj-section>
      <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px">
              Welcome to Subby
            </mj-text>
            <mj-text color="#637381" font-size="16px">
              Hi!,
            </mj-text>
            <mj-text color="#637381" font-size="16px">
              We're happy to welcome you to our family.
            </mj-text>
            <mj-text color="#637381" font-size="16px">
              Subby is an app that will help you manage the monthly subscriptions of your company. To start your work in our platform you just need to conclude your registration
            </mj-text>
            <mj-button background-color="#391085" align="center" color="#ffffff" font-size="17px" font-weight="bold" href={{url}} width="300px">
              Register
            </mj-button>
             <mj-text color="#637381" font-size="16px" padding-top="30px">
              Feel free to <a class="text-link" color="391085" href="mailto:subby.mailer@gmail.com">contact us</a> any time.
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="0">
          <mj-column width="100%">
            <mj-divider border-color="#DFE3E8" border-width="1px" />
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding="0 15px 0 15px">
          <mj-column width="100%">
            <mj-text color="#212b35" font-weight="bold" font-size="20px" padding-bottom="0">
              Proudly develop by Luismi
            </mj-text>
          </mj-column>
        </mj-section>
        <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px">
        </mj-section>
      </mj-wrapper>
      <mj-wrapper full-width="full-width">
        <mj-section>
          <mj-column width="100%" padding="0">
            <mj-social font-size="15px" icon-size="30px" mode="horizontal" padding="0" align="center">
              <mj-social-element name="github" href="https://github.com/luismiguelfeijoo" background-color="#A1A0A0">
              </mj-social-element>
              <mj-social-element name="linkedin" href="https://www.linkedin.com/in/luismifeijoo" background-color="#A1A0A0">
              </mj-social-element>
            </mj-social>
            
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              You are receiving this email regarding your Subby platform subscription! Subby is a app that let's any company keep track of their client's monthly subscriptions. It's currently in test period.
            </mj-text>
            <mj-text color="#445566" font-size="11px" align="center" line-height="16px">
              &copy; Luis Miguel Feijoo, All Rights Reserved.
            </mj-text>
          </mj-column>
        </mj-section>
        
      </mj-wrapper>
  
    </mj-body>
  </mjml>`);
  return mjml2html(template(context)).html;
};

module.exports = {
  newCompanyTemplate,
};
