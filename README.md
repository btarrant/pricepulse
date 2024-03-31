# PricePulse

PricePulse is an e-commerce price tracking app built with Next.js. It leverages web scraping and cron jobs to keep users updated on price changes for their favorite products. With PricePulse, users can simply input an Amazon product link, and the app will handle the rest, providing regular updates on pricing and availability.

Live Link: https://pricepulse-cyan.vercel.app

![Screenshot 2024-03-31 at 1 23 05 PM](https://github.com/btarrant/pricepulse/assets/93632053/5b9aa7ff-181c-416c-8c1f-40c95db971d1)

<div align="center">
   <img src="https://img.shields.io/badge/-Web_Scraping-black?style=for-the-badge&logoColor=white&color=FF0000" alt="webscraping" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" />
  </div>

</div>


## Features

- **Header with Carousel:** A visually appealing header with a carousel showcasing key features and benefits of PricePulse.

- **Product Scraping:** A user-friendly search bar allows users to input Amazon product links for scraping.

- **Scraped Products:** Displays the details of products scraped so far, offering insights into tracked items.

- **Scraped Product Details:** Showcase the product image, title, pricing, details, and other relevant information scraped from the original website.

- **Track Option:** Modal for users to provide email addresses and opt-in for tracking their favorite products.

- **Email Notifications:** PricePulse sends email product alert notifications for various scenarios, such as back in stock alerts or lowest price notifications.

- **Automated Cron Jobs:** Utilizes cron jobs to automate periodic scraping, ensuring that the data is always up-to-date.

- **Code Architecture and Reusability:** PricePulse is built with a modular and reusable code architecture, making it easy to maintain and extend.

## Technologies Used

- **Next.js:** popular React framework that enables developers to build server-rendered React applications with ease.

- **Bright Data:** Used for web scraping to gather product information from Amazon.

- **Cheerio:** A fast, flexible, and lean implementation of jQuery for server-side scraping of HTML.

- **Nodemailer:** For sending email notifications to users based on predefined triggers.

- **MongoDB:** Used as the database to store user data, product information, and tracking preferences.

- **Headless UI:** Provides accessible and reusable components for building interfaces in Next.js applications.

- **Tailwind CSS:** A utility-first CSS framework used for styling PricePulse, offering a responsive and modern design.

## Usage

1. Clone the repository:

```
git clone https://github.com/btarrant/pricepulse.git
```

2. Install dependencies:

```
cd pricepulse
npm install
```

3. Configure environment variables:

```
# Create a .env.local file and add the following variables
BRIGHT_DATA_API_KEY=your_bright_data_api_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
MONGODB_URI=your_mongodb_uri
```

4. Run the development server:

```
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000` to access PricePulse.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any features, bugs, or improvements you'd like to see in PricePulse.

## License

This project is licensed under the [MIT License](LICENSE).

---
Feel free to add any additional sections or information as needed. Happy coding!
