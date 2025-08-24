# web-dev__final
Final project of web development course, I'll be using HTML, CSS, JS, Node, Express, API's and some other cool stuff

## npm packages used
### Express
- it will allow me to use express to create a server and make calls to API's and make calls to my own API's

### Nodemon
- It will restart my server when it detects changes or I save the file

### EJS
- It will allow me to use EJS as the prefered templating lenguage

### dotenv
- is a tiny node package that reads .env files and injects the pairs into process.env at runtime
- the .env file is for storing secrets and configs to hide them and not hardcode them

### Helmet (security headers)
- its an express middleware that adds HTTP response headers to reduce very common web risks like:
  - clickjacking
  - mime sniffing
  - info leaks
- when the browser makes the response express sends the response + security headers

### express-rate-limit (throtel request)
- its a middleware that limits how many requests a client can make (usually an IP) within a time window
- it detects brute force and abuse

### path (save file and folder paths)
- its a node core module to build and parse file paths across Oses
- its kind of like legos for directories

### fileURLToPath
- it solves the problem with type="module" that does't get us __dirname/__filename automatically
- it converts the modules URL to filesystem path

### randomUUID (unique IDs)
- from node.js crypto module
- generates a version 4 UUID (a random, globally unique identifier)
- so basically it generates a random ID
