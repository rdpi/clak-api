# clak-api
RESTful Node.js backend for clak imageboard

## Installation
Using npm:
```
git clone https://github.com/rdpi/clak-api
cd clak-api
npm install
```
You must provide a mongoDB database and cloudinary database for image hosting in .env

## API Endpoints
* clak.fun/api/boards
  * GET: return a list of boards
  * POST: create a new board

* clak.fun/api/[BOARD]
  * GET: returns list of threads on [BOARD]
  * POST: create a new thread on board [BOARD]

* clak.fun/api/[BOARD]/thread/[THREAD ID]
  * GET: returns the thread corrisisponing to [THREAD ID] on [BOARD]
  * POST: create a new reply in [THREAD ID] on [BOARD]
