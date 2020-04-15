const Handlebars = require('handlebars');

const newCompanyTemplate = Handlebars.compile(`
<mjml>
<mj-head>
  <mj-title>Welcome to SUBBY</mj-title>
  <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500"></mj-font>
  <mj-attributes>
    <mj-all font-family="Montserrat, Helvetica, Arial, sans-serif"></mj-all>
    <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px"></mj-text>
    <mj-section padding="0px"></mj-section>
  </mj-attributes>
</mj-head>
<mj-body background-color="#F2F2F2">
  <mj-section padding="20px 20px 0 20px" background-color="#FFFFFF">
    <mj-column>
      <mj-text align="center" font-weight="300" padding="30px 40px 10px 40px" font-size="32px" line-height="40px" color="#531dab">Welcome to SUBBY</mj-text>
    </mj-column>
  </mj-section>
  <mj-section padding="10px 20px" background-color="#FFFFFF">
    <mj-column>
      <mj-divider width="30px" border-width="3px" border-color="#9B9B9B"></mj-divider>
    </mj-column>
  </mj-section>
  <mj-section padding="0 20px 20px 20px" background-color="#FFFFFF">
    <mj-column width="80%">
      <mj-text align="center" padding-top="10px" font-weight="500" padding="0px">You're just one step from making managing {{company}}'s subscriptions so much easier!</mj-text>
    </mj-column>
  </mj-section>
  <mj-section background-color="#096dd9" vertical-align="middle" background-size="cover" background-repeat="no-repeat">
    <mj-column width="100%">
      <mj-image src="http://nimus.de/share/tpl-card/lineshadow.png" alt="" align="center" border="none" padding="0px"></mj-image>
      <mj-text align="center" color="#ffffff" padding="50px 40px 0 40px" font-weight="300">We're glad to give you a welcome to our platform. To start managing subscriptions finish your register!</mj-text>
      <mj-button align="center" background-color="#531dab" color="#FFFFFF" border-radius="5px" href={{url}} inner-padding="15px 30px" padding-bottom="100px" padding-top="20px">REGISTER</mj-button>
    </mj-column>
  </mj-section>
  <mj-section padding="50px 0 0 0" background-color="#FFFFFF">
    <mj-column>
      <mj-image src="http://nimus.de/share/tpl-card/bottom.png" alt="bottom border" align="center" border="none" padding="0px"></mj-image>
    </mj-column>
  </mj-section>
</mj-body>
</mjml>`);

module.exports = {
  newCompanyTemplate,
};
