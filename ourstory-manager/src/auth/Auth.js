import auth0 from "auth0-js"
import { authConfig } from "../config"

export default class Auth {
  accessToken
  idToken
  expiresAt

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: "token id_token",
    scope: "openid",
  })

  constructor(history) {
    this.history = history

    this.getAccessToken = this.getAccessToken.bind(this)
    this.getIdToken = this.getIdToken.bind(this)
  }

  getAccessToken() {
    return `eyJhbGciOiJSUzI1NiIsImVudGl0bGVtZW50IjoiMTkwdWZwbnVoY3h0MGE3c2F2eTR0OSJ9.eyJpc3MiOiJvZmZsaW5lIiwic3ViIjoiMiIsImNvZ25pdG86Z3JvdXBzIjpbIkVESVRPUiJdLCJhdWQiOiJuYXRhbGlhIiwiaWF0IjoxNjU2NDkyNTE2LCJleHAiOjE3NTY0OTMxMTYsImFhYSI6IjV1Z2YydXN4ZjJ4OW8zeWhoMjlibyJ9.uBtb01HYwsTVr2cA1q3idxb64QHy-YNc6nKBhPV-yLyicVLbk6-EVFHDYJ6JTwZ8M9BuQ_JHxzQ1Pohhxe7oaCmUIdw91H1gj-QdfZItQMeqmR1rnb5jbFjpDgWqFSkfxMKtt8TXOze56sx9OswG3xE1ESB0Um-1qO4HaPcQNg9-NdtRpPIAq132NBeAGIkRnzRcbODQ-cejw8J2Oe5LfdZRtCaEnBqTqaKOpBFG7rYwUteSiiM32_be_WdSsijrj6CAcsa4Vb-Zc4u6i0AEYKW-CTJaDyVuWeQUjMenb_9qaU3ozGu6ATWHEhU_NDzopjCsI1o0y1REk6w0SeTIEg`
  }

  getIdToken() {
    return `eyJhbGciOiJSUzI1NiIsImVudGl0bGVtZW50IjoiMTkwdWZwbnVoY3h0MGE3c2F2eTR0OSJ9.eyJpc3MiOiJvZmZsaW5lIiwic3ViIjoiMiIsImNvZ25pdG86Z3JvdXBzIjpbIkVESVRPUiJdLCJhdWQiOiJuYXRhbGlhIiwiaWF0IjoxNjU2NDkyNTE2LCJleHAiOjE3NTY0OTMxMTYsImFhYSI6IjV1Z2YydXN4ZjJ4OW8zeWhoMjlibyJ9.uBtb01HYwsTVr2cA1q3idxb64QHy-YNc6nKBhPV-yLyicVLbk6-EVFHDYJ6JTwZ8M9BuQ_JHxzQ1Pohhxe7oaCmUIdw91H1gj-QdfZItQMeqmR1rnb5jbFjpDgWqFSkfxMKtt8TXOze56sx9OswG3xE1ESB0Um-1qO4HaPcQNg9-NdtRpPIAq132NBeAGIkRnzRcbODQ-cejw8J2Oe5LfdZRtCaEnBqTqaKOpBFG7rYwUteSiiM32_be_WdSsijrj6CAcsa4Vb-Zc4u6i0AEYKW-CTJaDyVuWeQUjMenb_9qaU3ozGu6ATWHEhU_NDzopjCsI1o0y1REk6w0SeTIEg`
  }

  isAuthenticated() {
    return true
  }
}
