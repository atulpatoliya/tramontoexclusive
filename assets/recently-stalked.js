var RecentlyViewedProducts = class extends HTMLElement {
    async connectedCallback() {
      if (this.searchQueryString === "") {
        return;
      }

      const response = await fetch(`${window.searchUrl}?type=product&q=${this.searchQueryString}&section_id=${this.sectionId}`);
      let responceText = await response.text();
      const parser = new DOMParser();
      let responcehtml = parser.parseFromString(responceText, "text/html");
      let recentlyViewedProductsElement = responcehtml.querySelector("recently-viewed-products");

      let localStorageIds = this.searchQueryString.split(' OR ');
      let removeIdPrefix = arr => arr.map(id => id.replace('id:', ''));
      let cleanedIds = removeIdPrefix(localStorageIds).map((item) => {
        let element = recentlyViewedProductsElement.querySelector(`[data-product-id='${item}']`);
        return element ? element.outerHTML : null;
      }).filter(item => item != null);

      if(cleanedIds.length == 0) return;
      this.classList.remove('hidden');
      console.log(responcehtml)
      console.log(recentlyViewedProductsElement.querySelector('[data-section-type="home-section-recently-viewed-section"]'))
      recentlyViewedProductsElement.querySelector('[data-section-type="home-section-recently-viewed-section"] .swiper-wrapper').innerHTML = cleanedIds.join('');
      
      if (recentlyViewedProductsElement.hasChildNodes()) {
        this.innerHTML = recentlyViewedProductsElement.innerHTML;
      }

      let $container = $(this.querySelector('[data-section-type="home-section-recently-viewed-section"]'));
      let sectionId = "home-section-recently-viewed-section";
      console.log("$container ::: ",$container)
      dT_Swiper($container);
      dt_initQuickShop(sectionId);
      dt_activateQuickShop();
      // this.initSlider();
    }
    get searchQueryString() {
      const items = JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]");
      if (this.hasAttribute("exclude-product-id") && items.includes(parseInt(this.getAttribute("exclude-product-id")))) {
        items.splice(items.indexOf(parseInt(this.getAttribute("exclude-product-id"))), 1);
      }
      return items.map((item) => "id:" + item).slice(0, this.productsCount).join(" OR ");
    }
    get sectionId() {
      return this.getAttribute("section-id");
    }
    get productsCount() {
      return this.getAttribute("products-count") || 4;
    }

     initSlider() {
      var elem = this.querySelector('.js-flikty-slider');
      let prevButton = this.querySelector('.button--previous');
      let nextButton = this.querySelector('.button--next');
      
      if (elem) {
        var flkty = new Flickity(elem, {
          cellAlign: 'left',
          contain: true,
          groupCells: true,
          pageDots: false,
          prevNextButtons: false, 
          on: {
            scroll: progress => {
              let calc = Math.max(0, Math.min(1, progress));
              prevButton && (prevButton.disabled = calc == 0);
              nextButton && (nextButton.disabled = calc == 1);
            }
          }
        });
      }
    
      if (prevButton) {
        prevButton.addEventListener('click', () => flkty.previous());
      }
      if (nextButton) {
        nextButton.addEventListener('click', () => flkty.next());
      }
    }


  };
  window.customElements.define("recently-viewed-products", RecentlyViewedProducts);