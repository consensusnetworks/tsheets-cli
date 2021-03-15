# tsheets
A CLI tool for clocking in and out of TSheets using the public API released by the TSheets team https://tsheetsteam.github.io/api_docs/?javascript--node#introduction

### Current development setup
1. Clone this repository locally
2. Run `npm i` and then `npm link` in the local repository's root
3. Run `tsheets` to configure and use the CLI

### Todo before v1
1. Set up refresh tokens https://tsheetsteam.github.io/api_docs/?javascript--node#refreshing-an-access-token
2. Verify app with TSheets team https://tsheetsteam.github.io/api_docs/?javascript--node#connection-count-information
3. Add user installation, setup and usage guide to README.md
4. Create public npm package and set up version control
5. Add unit tests
6. Remove async from sync functions (nice to have)
7. Clean up Oauth2 server/flow (nice to have)
8. Add command flags to optionally bypass menu (nice to have)
9. Add Typescript https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html (nice to have)
