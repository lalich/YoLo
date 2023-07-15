# YoLo Application

- **Project Name:** YoLo Application
- **Project By:** Mark D. Lalich
- [**LINK TO GITHUB**] https://github.com/lalich/YoLo.git
- [**LINK TO DEPLOYED WEBSITE**] https://yolo-application.onrender.com/
- **List of Technologies used:** HTML, JS, CSS, Node, Express, EJS, Mongo, Auth
- [**LINK TO TRELLO**]https://miro.com/app/board/uXjVMFQnZAA=/#tpicker-content

## Description


    The YoLo application is designed to afford for the speculator to make money on their principal with a given risk/return input on thier chosen investment vehicle. We are starting with Stocks and Options, but future itterations will open access to round the clock futures, commodoties, real estate, currency, and other off exchange products not generally available. This application will require notifications and you are not going to want to miss the push opportunities of new products to speculate on. 

    The idea stemmed from many years on chat forums as a professional invesment manager witnessing the countless mistakes made. Watching BILLIONS lost by just not following the speculators rule book of a strategy going in and out of a trade and it not changing.

## Mock UP of UI

- ![Desktop View]/Users/marklalich/Desktop/Desktop - Mark’s MacBook Pro/kale/unit2/project/public/MiRo.png
- ![Mobile View]/Users/marklalich/Desktop/Desktop - Mark’s MacBook Pro/kale/unit2/project/public/MiRo.png

## List of Backend Endpoints

| ENDPOINT         | METHOD | PURPOSE                  |
|------------------|--------|--------------------------|
|/yolo-application | get    |home w/ create or log-in  |
|/user/create      | get    | create user              |
|/user/login       | get    | log-in user              |
|/yolos            | get    | user's personal yolo page|
|/yolos/:id        | get    |individual yolo page      |
|/addie            | post   |create individual yolo    |
|/edit:id          | post   |edit yolo/bet             |
|/delete           | post   |delete yolo early         |
|/wsryC            | post   |create Wall Stree roulette|


## ERD (ENTITY RELATIONSHIP DIAGRAM)

![PICTURE OF ERD] https://miro.com/app/board/uXjVMFQnZAA=/#tpicker-content
