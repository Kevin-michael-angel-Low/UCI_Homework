# import dependencies
from splinter import Browser
from bs4 import BeautifulSoup as soup
import pandas as pd
import datetime as dt


def scrape_all():
    browser = Browser("chrome", executable_path="chromedriver", headless=True)
    news_title, news_paragraph = mars_news(browser)

    # run scraping functions and store in data dictionary
    data = {
        "news_title": news_title,
        "news_paragraph": news_paragraph,
        "featured_image": featured_image(browser),
        "facts": mars_facts(),
        "hemispheres": hemispheres(browser),
        "last_modified": dt.datetime.now()
    }

    browser.quit()
    return data


def mars_news(browser):

    # visit site
    url = 'https://mars.nasa.gov/news/'
    browser.visit(url)
    html = browser.html
    news_soup = soup(html, 'html.parser')

    return news_title, news_p


def featured_image(browser):
    # Visit URL
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)

    # click full image button
    full_image_elem = browser.find_by_id('full_image')[0]
    full_image_elem.click()

    # click more info button
    more_info_elem = browser.links.find_by_partial_text('more info')
    more_info_elem.click()

    # Parse with soup
    html = browser.html
    img_soup = soup(html, 'html.parser')


    # Concatenate image urls
    img_url = f'https://www.jpl.nasa.gov{img_url_rel}'
    return img_url

def mars_facts():
    # assign columns and set index of dataframe
    df.columns = ['Description', 'Mars']
    df.set_index('Description', inplace=True)

    # Convert dataframe into HTML format, add bootstrap
    return df.to_html(classes="table table-striped")


def hemispheres(browser):
    url = ("https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars")
    browser.visit(url)

    # return href
    hemisphere_image_urls = []
    for i in range(4):
        browser.find_by_css("a.product-item h3")[i].click()
        hemi_data = scrape_hemisphere(browser.html)
        
        # Append hemisphere object to list of urls
        hemisphere_image_urls.append(hemi_data)
        browser.back()

    return hemisphere_image_urls


def scrape_hemisphere(html_text):
    hemi_soup = soup(html_text, "html.parser")

    hemispheres = {
        "title": title_elem,
        "img_url": sample_elem
    }

    return hemispheres


if __name__ == "__main__":

    # If running as script, print scraped data
    print(scrape_all())
