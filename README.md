# tsheets
A CLI tool for clocking in and out of TSheets, made using the public TSheets API https://tsheetsteam.github.io/api_docs/?javascript--node#introduction

### Current development setup
1. Clone this repository locally
2. Run `npm i` and then `npm link` in the local repository's root
3. Run `tsheets` to configure and use the CLI

### Todo before v1
1. Set up refresh tokens https://tsheetsteam.github.io/api_docs/?javascript--node#refreshing-an-access-token
2. Verify app with TSheets team https://tsheetsteam.github.io/api_docs/?javascript--node#connection-count-information
3. Add user installation, setup and usage guide to README.md
4. Clean up Oauth2 server/flow
5. Add unit tests
6. Add command flags to optionally bypass menu
