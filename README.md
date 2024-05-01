# Holly
This is the source code of my blog, if you want to know details about the tech, here is the [article](https://holly.pw/$/this-is-my-new-blog). It also uses a custom build system, to install look at this [repository](https://github.com/hollydotpw/x).

## Requirements
Bun: `>=1.0.13`  
Wrangler: `>=3.16.0`  
X: `>=0.1.0`

## Setup
```bash
x bloat
bun install
```

## Building

### Development
Run the following command to start the development server:
```bash
x dev
```

### Production
Run the following command to build and deploy the project:
```bash
x prod
cp ./dist/holly-worker/entry.js ./dist/holly-web/_worker.js
bunx wrangler pages deploy ./dist/holly-web --no-bundle --commit-dirty --project-name holly
```