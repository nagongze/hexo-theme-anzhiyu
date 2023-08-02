// 第一次播放音樂
var anzhiyu_musicFirst = false;
// 音樂播放狀態
var anzhiyu_musicPlaying = false;
// 是否開啟快捷鍵
var anzhiyu_keyboard = localStorage.getItem("keyboardToggle") ? localStorage.getItem("keyboardToggle") : false;
var $web_container = document.getElementById("web_container");
var $web_box = document.getElementById("web_box");
var $bodyWrap = document.getElementById("body-wrap");
var $main = document.querySelector("main");
var dragStartX;

var adjectives = [
  "美麗的",
  "英俊的",
  "聰明的",
  "勇敢的",
  "可愛的",
  "慷慨的",
  "善良的",
  "可靠的",
  "開朗的",
  "成熟的",
  "穩重的",
  "真誠的",
  "幽默的",
  "豁達的",
  "有趣的",
  "活潑的",
  "優雅的",
  "敏捷的",
  "溫柔的",
  "溫暖的",
  "敬業的",
  "細心的",
  "耐心的",
  "深沉的",
  "樸素的",
  "含蓄的",
  "率直的",
  "開放的",
  "務實的",
  "堅強的",
  "自信的",
  "謙虛的",
  "文靜的",
  "深刻的",
  "純真的",
  "朝氣蓬勃的",
  "慎重的",
  "大方的",
  "頑強的",
  "迷人的",
  "機智的",
  "善解人意的",
  "富有想象力的",
  "有魅力的",
  "獨立的",
  "好奇的",
  "乾淨的",
  "寬容的",
  "尊重他人的",
  "體貼的",
  "守信的",
  "有耐性的",
  "有責任心的",
  "有擔當的",
  "有遠見的",
  "有智慧的",
  "有眼光的",
  "有冒險精神的",
  "有愛心的",
  "有同情心的",
  "喜歡思考的",
  "喜歡學習的",
  "具有批判性思維的",
  "善於表達的",
  "善於溝通的",
  "善於合作的",
  "善於領導的",
  "有激情的",
  "有幽默感的",
  "有思想的",
  "有個性的",
  "有正義感的",
  "有責任感的",
  "有創造力的",
  "有想象力的",
  "有藝術細胞的",
  "有團隊精神的",
  "有協調能力的",
  "有決策能力的",
  "有組織能力的",
  "有學習能力的",
  "有執行能力的",
  "有分析能力的",
  "有邏輯思維的",
  "有創新能力的",
  "有專業素養的",
  "有商業頭腦的",
];

var vegetablesAndFruits = [
  "蘿蔔",
  "白菜",
  "芹菜",
  "生菜",
  "青椒",
  "辣椒",
  "茄子",
  "豆角",
  "黃瓜",
  "番茄",
  "洋蔥",
  "大蒜",
  "馬鈴薯",
  "南瓜",
  "豆腐",
  "韭菜",
  "花菜",
  "花椰菜",
  "蘑菇",
  "金針菇",
  "蘋果",
  "香蕉",
  "柳橙",
  "檸檬",
  "奇異果",
  "草莓",
  "葡萄",
  "水蜜桃",
  "杏子",
  "李子",
  "芭樂",
  "西瓜",
  "哈密瓜",
  "蜜瓜",
  "櫻桃",
  "藍莓",
  "柿子",
  "橄欖",
  "柚子",
  "火龍果",
];
document.addEventListener("DOMContentLoaded", function () {
  function onDragStart(event) {
    // event.preventDefault();
    dragStartX = getEventX(event);
    $web_box.style.transition = "all .3s";
    addMoveEndListeners(onDragMove, onDragEnd);
  }

  function onDragMove(event) {
    const deltaX = getEventX(event) - dragStartX;
    if (deltaX < 0) {
      const screenWidth = window.innerWidth;
      const translateX = Math.min(-300, ((-1 * deltaX) / screenWidth) * 300);
      const scale = Math.min(1, 0.86 + (deltaX / screenWidth) * (1 - 0.86));
      $web_box.style.transform = `translate3d(-${translateX}px, 0px, 0px) scale3d(${scale}, ${scale}, 1)`;
    }
  }

  function onDragEnd(event) {
    const screenWidth = window.innerWidth;
    if (getEventX(event) <= screenWidth / 1.5) {
      completeTransition();
    } else {
      resetTransition();
    }
    removeMoveEndListeners(onDragMove, onDragEnd);
  }

  function completeTransition() {
    $web_box.style.transition = "all 0.3s ease-out";
    $web_box.style.transform = "none";
    sidebarFn.close();
    removeMoveEndListeners(onDragMove, onDragEnd);
  }

  function resetTransition() {
    $web_box.style.transition = "";
    $web_box.style.transform = "";
  }

  function getEventX(event) {
    return event.type.startsWith("touch") ? event.changedTouches[0].clientX : event.clientX;
  }

  function addMoveEndListeners(moveHandler, endHandler) {
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("touchend", endHandler);
  }

  function removeMoveEndListeners(moveHandler, endHandler) {
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("mouseup", endHandler);
    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("touchend", endHandler);
  }

  let blogNameWidth, menusWidth, searchWidth;
  let mobileSidebarOpen = false;
  const $sidebarMenus = document.getElementById("sidebar-menus");
  const $rightside = document.getElementById("rightside");
  let $nav = document.getElementById("nav");
  const adjustMenu = init => {
    if (init) {
      blogNameWidth = document.getElementById("site-name").offsetWidth;
      const $menusEle = document.querySelectorAll("#menus .menus_item");
      menusWidth = 0;
      $menusEle.length &&
        $menusEle.forEach(i => {
          menusWidth += i.offsetWidth;
        });
      const $searchEle = document.querySelector("#search-button");
      searchWidth = $searchEle ? $searchEle.offsetWidth : 0;
      $nav = document.getElementById("nav");
    }

    let hideMenuIndex = "";
    if (window.innerWidth <= 768) hideMenuIndex = true;
    else hideMenuIndex = blogNameWidth + menusWidth + searchWidth > $nav.offsetWidth - 120;

    if (hideMenuIndex) {
      $nav.classList.add("hide-menu");
    } else {
      $nav.classList.remove("hide-menu");
    }
  };

  // 初始化header
  const initAdjust = () => {
    adjustMenu(true);
    $nav.classList.add("show");
  };

  // sidebar menus
  const sidebarFn = {
    open: () => {
      anzhiyu.sidebarPaddingR();
      anzhiyu.changeThemeMetaColor("#607d8b");
      anzhiyu.animateIn(document.getElementById("menu-mask"), "to_show 0.5s");
      $sidebarMenus.classList.add("open");
      $web_box.classList.add("open");
      $rightside.classList.add("hide");
      $nav.style.borderTopLeftRadius = "12px";
      mobileSidebarOpen = true;
      document.body.style.overflow = "hidden";
      $web_box.addEventListener("mousedown", onDragStart);
      $web_box.addEventListener("touchstart", onDragStart, { passive: false });
      if (window.location.pathname.startsWith("/music/")) {
        $web_container.style.background = "rgb(255 255 255 / 20%)";
      } else {
        $web_container.style.background = "var(--global-bg)";
      }
    },
    close: () => {
      const $body = document.body;
      anzhiyu.initThemeColor();
      $body.style.paddingRight = "";
      anzhiyu.animateOut(document.getElementById("menu-mask"), "to_hide 0.5s");
      $sidebarMenus.classList.remove("open");
      $web_box.classList.remove("open");
      $rightside.classList.remove("hide");
      $nav.style.borderTopLeftRadius = "0px";
      mobileSidebarOpen = false;
      document.body.style.overflow = "auto";
      anzhiyu.addNavBackgroundInit();
    },
  };

  /**
   * 首頁top_img底下的箭頭
   */
  const scrollDownInIndex = () => {
    const $bbTimeList = document.getElementById("bbTimeList");
    const $scrollDownEle = document.getElementById("scroll-down");
    $scrollDownEle &&
      $scrollDownEle.addEventListener("click", function () {
        if ($bbTimeList) {
          anzhiyu.scrollToDest($bbTimeList.offsetTop, 300);
        } else {
          anzhiyu.scrollToDest(document.getElementById("content-inner").offsetTop, 300);
        }
      });
  };

  /**
   * 代码
   * 只适用于Hexo默认的代码渲染
   */
  const addHighlightTool = function () {
    const highLight = GLOBAL_CONFIG.highlight;
    if (!highLight) return;

    const isHighlightCopy = highLight.highlightCopy;
    const isHighlightLang = highLight.highlightLang;
    const isHighlightShrink = GLOBAL_CONFIG_SITE.isHighlightShrink;
    const highlightHeightLimit = highLight.highlightHeightLimit;
    const isShowTool = isHighlightCopy || isHighlightLang || isHighlightShrink !== undefined;
    const $figureHighlight =
      highLight.plugin === "highlighjs"
        ? document.querySelectorAll("figure.highlight")
        : document.querySelectorAll('pre[class*="language-"]');

    if (!((isShowTool || highlightHeightLimit) && $figureHighlight.length)) return;

    const isPrismjs = highLight.plugin === "prismjs";

    let highlightShrinkEle = "";
    let highlightCopyEle = "";
    const highlightShrinkClass = isHighlightShrink === true ? "closed" : "";

    if (isHighlightShrink !== undefined) {
      highlightShrinkEle = `<i class="anzhiyufont anzhiyu-icon-angle-down expand ${highlightShrinkClass}"></i>`;
    }

    if (isHighlightCopy) {
      highlightCopyEle = '<div class="copy-notice"></div><i class="anzhiyufont anzhiyu-icon-paste copy-button"></i>';
    }

    const copy = (text, ctx) => {
      if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        document.execCommand("copy");
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
          anzhiyu.snackbarShow(GLOBAL_CONFIG.copy.success);
        } else {
          const prevEle = ctx.previousElementSibling;
          prevEle.innerText = GLOBAL_CONFIG.copy.success;
          prevEle.style.opacity = 1;
          setTimeout(() => {
            prevEle.style.opacity = 0;
          }, 700);
        }
      } else {
        if (GLOBAL_CONFIG.Snackbar !== undefined) {
          anzhiyu.snackbarShow(GLOBAL_CONFIG.copy.noSupport);
        } else {
          ctx.previousElementSibling.innerText = GLOBAL_CONFIG.copy.noSupport;
        }
      }
    };

    // click events
    const highlightCopyFn = ele => {
      const $buttonParent = ele.parentNode;
      $buttonParent.classList.add("copy-true");
      const selection = window.getSelection();
      const range = document.createRange();
      if (isPrismjs) range.selectNodeContents($buttonParent.querySelectorAll("pre code")[0]);
      else range.selectNodeContents($buttonParent.querySelectorAll("table .code pre")[0]);
      selection.removeAllRanges();
      selection.addRange(range);
      const text = selection.toString();
      copy(text, ele.lastChild);
      selection.removeAllRanges();
      $buttonParent.classList.remove("copy-true");
    };

    const highlightShrinkFn = ele => {
      const $nextEle = [...ele.parentNode.children].slice(1);
      ele.firstChild.classList.toggle("closed");
      if (anzhiyu.isHidden($nextEle[$nextEle.length - 1])) {
        $nextEle.forEach(e => {
          e.style.display = "block";
        });
      } else {
        $nextEle.forEach(e => {
          e.style.display = "none";
        });
      }
    };

    const highlightToolsFn = function (e) {
      const $target = e.target.classList;
      if ($target.contains("expand")) highlightShrinkFn(this);
      else if ($target.contains("copy-button")) highlightCopyFn(this);
    };

    const expandCode = function () {
      this.classList.toggle("expand-done");
    };

    function createEle(lang, item, service) {
      const fragment = document.createDocumentFragment();

      if (isShowTool) {
        const hlTools = document.createElement("div");
        hlTools.className = `highlight-tools ${highlightShrinkClass}`;
        hlTools.innerHTML = highlightShrinkEle + lang + highlightCopyEle;
        hlTools.addEventListener("click", highlightToolsFn);
        fragment.appendChild(hlTools);
      }

      if (highlightHeightLimit && item.offsetHeight > highlightHeightLimit + 30) {
        const ele = document.createElement("div");
        ele.className = "code-expand-btn";
        ele.innerHTML = '<i class="anzhiyufont anzhiyu-icon-angle-double-down"></i>';
        ele.addEventListener("click", expandCode);
        fragment.appendChild(ele);
      }

      if (service === "hl") {
        item.insertBefore(fragment, item.firstChild);
      } else {
        item.parentNode.insertBefore(fragment, item);
      }
    }

    if (isHighlightLang) {
      if (isPrismjs) {
        $figureHighlight.forEach(function (item) {
          const langName = item.getAttribute("data-language") ? item.getAttribute("data-language") : "Code";
          const highlightLangEle = `<div class="code-lang">${langName}</div>`;
          anzhiyu.wrap(item, "figure", { class: "highlight" });
          createEle(highlightLangEle, item);
        });
      } else {
        $figureHighlight.forEach(function (item) {
          let langName = item.getAttribute("class").split(" ")[1];
          if (langName === "plain" || langName === undefined || langName === "plaintext") langName = "Code";
          const highlightLangEle = `<div class="code-lang">${langName}</div>`;
          createEle(highlightLangEle, item, "hl");
        });
      }
    } else {
      if (isPrismjs) {
        $figureHighlight.forEach(function (item) {
          anzhiyu.wrap(item, "figure", { class: "highlight" });
          createEle("", item);
        });
      } else {
        $figureHighlight.forEach(function (item) {
          createEle("", item, "hl");
        });
      }
    }
  };

  /**
   * PhotoFigcaption
   */
  function addPhotoFigcaption() {
    document.querySelectorAll("#article-container img").forEach(function (item) {
      const parentEle = item.parentNode;
      const altValue = item.title || item.alt;
      if (altValue && !parentEle.parentNode.classList.contains("justified-gallery")) {
        const ele = document.createElement("div");
        ele.className = "img-alt is-center";
        ele.textContent = altValue;
        parentEle.insertBefore(ele, item.nextSibling);
      }
    });
  }

  /**
   * Lightbox
   */
  const runLightbox = () => {
    anzhiyu.loadLightbox(document.querySelectorAll("#article-container img:not(.no-lightbox)"));
  };

  /**
   * justified-gallery 相簿排版
   */
  const runJustifiedGallery = function (ele) {
    const htmlStr = arr => {
      let str = "";
      const replaceDq = str => str.replace(/"/g, "&quot;"); // replace double quotes to &quot;
      arr.forEach(i => {
        const alt = i.alt ? `alt="${replaceDq(i.alt)}"` : "";
        const title = i.title ? `title="${replaceDq(i.title)}"` : "";
        const address = i.address ? i.address : "";
        const galleryItem = `
        <div class="fj-gallery-item">
          ${address ? `<div class="tag-address">${address}</div>` : ""}
          <img src="${i.url}" ${alt + title}>
        </div>
      `;
        str += galleryItem;
      });

      return str;
    };

    const lazyloadFn = (i, arr, limit) => {
      const loadItem = Number(limit);
      const arrLength = arr.length;
      if (arrLength > loadItem) i.insertAdjacentHTML("beforeend", htmlStr(arr.splice(0, loadItem)));
      else {
        i.insertAdjacentHTML("beforeend", htmlStr(arr));
        i.classList.remove("lazyload");
      }
      window.lazyLoadInstance && window.lazyLoadInstance.update();
      return arrLength > loadItem ? loadItem : arrLength;
    };

    const fetchUrl = async url => {
      const response = await fetch(url);
      return await response.json();
    };

    const runJustifiedGallery = (item, arr) => {
      const limit = item.getAttribute("data-limit") ?? arr.length;
      if (!item.classList.contains("lazyload") || arr.length < limit) {
        // 不懶載入
        item.innerHTML = htmlStr(arr);
        item.nextElementSibling.style.display = "none"
      } else {
        if (!item.classList.contains("btn_album_detail_lazyload") || item.classList.contains("page_img_lazyload")) {
          // 滾動懶載入
          lazyloadFn(item, arr, limit);
          const clickBtnFn = () => {
            const lastItemLength = lazyloadFn(item, arr, limit);
            fjGallery(
              item,
              "appendImages",
              item.querySelectorAll(`.fj-gallery-item:nth-last-child(-n+${lastItemLength})`)
            );
            anzhiyu.loadLightbox(item.querySelectorAll("img"));
            if (lastItemLength < Number(limit)) {
              observer.unobserve(item.nextElementSibling);
            }
          };

          // 建立IntersectionObserver例項
          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              // 如果元素進入視口
              if (entry.isIntersecting) {
                // 執行clickBtnFn函式
                setTimeout(clickBtnFn(), 100);
              }
            });
          });
          observer.observe(item.nextElementSibling);
        } else {
          // 相簿詳情 按鈕懶載入
          lazyloadFn(item, arr, limit);
          const clickBtnFn = () => {
            const lastItemLength = lazyloadFn(item, arr, limit);
            fjGallery(
              item,
              "appendImages",
              item.querySelectorAll(`.fj-gallery-item:nth-last-child(-n+${lastItemLength})`)
            );
            anzhiyu.loadLightbox(item.querySelectorAll("img"));
            lastItemLength < limit && item.nextElementSibling.removeEventListener("click", clickBtnFn);
          };
          item.nextElementSibling.addEventListener("click", clickBtnFn);
        }
      }

      anzhiyu.initJustifiedGallery(item);
      anzhiyu.loadLightbox(item.querySelectorAll("img"));
      window.lazyLoadInstance && window.lazyLoadInstance.update();
    };

    const addJustifiedGallery = () => {
      ele.forEach(item => {
        item.classList.contains("url")
          ? fetchUrl(item.textContent).then(res => {
              runJustifiedGallery(item, res);
            })
          : runJustifiedGallery(item, JSON.parse(item.textContent));
      });
    };

    if (window.fjGallery) {
      addJustifiedGallery();
      return;
    }

    getCSS(`${GLOBAL_CONFIG.source.justifiedGallery.css}`);
    getScript(`${GLOBAL_CONFIG.source.justifiedGallery.js}`).then(addJustifiedGallery);
  };

  /**
   * 滾動處理
   */
  const scrollFn = function () {
    const $rightside = document.getElementById("rightside");
    const innerHeight = window.innerHeight + 56;
    let lastScrollTop = 0;

    if (document.body.scrollHeight <= innerHeight) {
      $rightside.style.cssText = "opacity: 1; transform: translateX(-58px)";
    }

    // find the scroll direction
    function scrollDirection(currentTop) {
      const result = currentTop > initTop; // true is down & false is up
      initTop = currentTop;
      return result;
    }

    let initTop = 0;
    let isChatShow = true;
    const $header = document.getElementById("page-header");
    const isChatBtnHide = typeof chatBtnHide === "function";
    const isChatBtnShow = typeof chatBtnShow === "function";

    // 第一次滑動到底部的識別符號
    let scrollBottomFirstFlag = false;
    // 快取常用dom元素
    const musicDom = document.getElementById("nav-music"),
      footerDom = document.getElementById("footer"),
      waterfallDom = document.getElementById("waterfall"),
      $percentBtn = document.getElementById("percent"),
      $navTotop = document.getElementById("nav-totop"),
      $bodyWrap = document.getElementById("body-wrap");
    // 頁面底部Dom是否存在
    let pageBottomDomFlag = document.getElementById("post-comment") || document.getElementById("footer");

    function percentageScrollFn(currentTop) {
      // 處理滾動百分比
      let docHeight = $bodyWrap.clientHeight;
      const winHeight = document.documentElement.clientHeight;
      const contentMath =
        docHeight > winHeight ? docHeight - winHeight : document.documentElement.scrollHeight - winHeight;
      const scrollPercent = currentTop / contentMath;
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      const percentage = scrollPercentRounded > 100 ? 100 : scrollPercentRounded <= 0 ? 1 : scrollPercentRounded;
      $percentBtn.textContent = percentage;

      function isInViewPortOfOneNoDis(el) {
        if (!el) return;
        const elDisplay = window.getComputedStyle(el).getPropertyValue("display");
        if (elDisplay == "none") {
          return;
        }
        const viewPortHeight =
          window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const offsetTop = el.offsetTop;
        const scrollTop = document.documentElement.scrollTop;
        const top = offsetTop - scrollTop;
        return top <= viewPortHeight;
      }

      if (isInViewPortOfOneNoDis(pageBottomDomFlag) || percentage > 90) {
        $navTotop.classList.add("long");
        $percentBtn.textContent = "返回頂部";
      } else {
        $navTotop.classList.remove("long");
        $percentBtn.textContent = percentage;
      }

      // 如果當前頁面需要瀑布流，就處理瀑布流
      if (waterfallDom) {
        const waterfallResult = currentTop % document.documentElement.clientHeight; // 捲去一個視口
        if (!scrollBottomFirstFlag && waterfallResult + 100 >= document.documentElement.clientHeight) {
          console.info(waterfallResult, document.documentElement.clientHeight);
          setTimeout(() => {
            waterfall("#waterfall");
          }, 500);
        } else {
          setTimeout(() => {
            waterfallDom && waterfall("#waterfall");
          }, 500);
        }
      }
    }

    const scroolTask = anzhiyu.throttle(() => {
      const currentTop = window.scrollY || document.documentElement.scrollTop;
      const isDown = scrollDirection(currentTop);

      const delta = Math.abs(lastScrollTop - currentTop);
      if (currentTop > 60 && delta < 20 && delta != 0) {
        // ignore small scrolls
        return;
      }
      lastScrollTop = currentTop;
      if (currentTop > 26) {
        if (isDown) {
          if ($header.classList.contains("nav-visible")) $header.classList.remove("nav-visible");
          if (isChatBtnShow && isChatShow === true) {
            chatBtnHide();
            isChatShow = false;
          }
        } else {
          if (!$header.classList.contains("nav-visible")) $header.classList.add("nav-visible");
          if (isChatBtnHide && isChatShow === false) {
            chatBtnShow();
            isChatShow = true;
          }
        }
        requestAnimationFrame(() => {
          anzhiyu.initThemeColor();
          $header.classList.add("nav-fixed");
        });
        if (window.getComputedStyle($rightside).getPropertyValue("opacity") === "0") {
          $rightside.style.cssText = "opacity: 0.8; transform: translateX(-58px)";
        }
      } else {
        if (currentTop <= 5) {
          requestAnimationFrame(() => {
            $header.classList.remove("nav-fixed");
            $header.classList.remove("nav-visible");
            // 修改頂欄顏色
            anzhiyu.initThemeColor();
          });
        }
        $rightside.style.cssText = "opacity: ''; transform: ''";
      }

      if (document.body.scrollHeight <= innerHeight) {
        $rightside.style.cssText = "opacity: 0.8; transform: translateX(-58px)";
      }
      
      percentageScrollFn(currentTop);
    }, 96);

    // 進入footer隱藏音樂
    if (footerDom) {
      anzhiyu
        .intersectionObserver(
          () => {
            if (footerDom && musicDom && 768 < document.body.clientWidth) {
              musicDom.style.bottom = "-10px";
              musicDom.style.opacity = "0";
            }
            scrollBottomFirstFlag = true;
          },
          () => {
            if (footerDom && musicDom && 768 < document.body.clientWidth) {
              musicDom.style.bottom = "20px";
              musicDom.style.opacity = "1";
            }
          }
        )()
        .observe(footerDom);
    }

    window.scrollCollect = scroolTask;
    window.addEventListener("scroll", scrollCollect);
  };

  /**
   * toc,anchor
   */
  const scrollFnToDo = function () {
    const isToc = GLOBAL_CONFIG_SITE.isToc;
    const isAnchor = GLOBAL_CONFIG.isAnchor;
    const $article = document.getElementById("article-container");

    if (!($article && (isToc || isAnchor))) return;

    let $tocLink, $cardToc, autoScrollToc, isExpand;
    if (isToc) {
      const $cardTocLayout = document.getElementById("card-toc");
      $cardToc = $cardTocLayout.getElementsByClassName("toc-content")[0];
      $tocLink = $cardToc.querySelectorAll(".toc-link");
      isExpand = $cardToc.classList.contains("is-expand");

      window.mobileToc = {
        open: () => {
          $cardTocLayout.style.cssText = "animation: toc-open .3s; opacity: 1; right: 55px";
        },

        close: () => {
          $cardTocLayout.style.animation = "toc-close .2s";
          setTimeout(() => {
            $cardTocLayout.style.cssText = "opacity:''; animation: ''; right: ''";
          }, 100);
        },
      };

      // toc元素點選
      $cardToc.addEventListener("click", e => {
        e.preventDefault();
        const target = e.target.classList;
        if (target.contains("toc-content")) return;
        const $target = target.contains("toc-link") ? e.target : e.target.parentElement;
        anzhiyu.scrollToDest(
          anzhiyu.getEleTop(document.getElementById(decodeURI($target.getAttribute("href")).replace("#", ""))) - 60,
          300
        );
        if (window.innerWidth < 900) {
          window.mobileToc.close();
        }
      });

      autoScrollToc = item => {
        const activePosition = item.getBoundingClientRect().top;
        const sidebarScrollTop = $cardToc.scrollTop;
        if (activePosition > document.documentElement.clientHeight - 100) {
          $cardToc.scrollTop = sidebarScrollTop + 150;
        }
        if (activePosition < 100) {
          $cardToc.scrollTop = sidebarScrollTop - 150;
        }
      };
    }

    // find head position & add active class
    const list = $article.querySelectorAll("h1,h2,h3,h4,h5,h6");
    let detectItem = "";
    const findHeadPosition = function (top) {
      if (top === 0) {
        return false;
      }

      let currentId = "";
      let currentIndex = "";

      list.forEach(function (ele, index) {
        if (top > anzhiyu.getEleTop(ele) - 80) {
          const id = ele.id;
          currentId = id ? "#" + encodeURI(id) : "";
          currentIndex = index;
        }
      });

      if (detectItem === currentIndex) return;

      if (isAnchor) anzhiyu.updateAnchor(currentId);

      detectItem = currentIndex;

      if (isToc) {
        $cardToc.querySelectorAll(".active").forEach(i => {
          i.classList.remove("active");
        });

        if (currentId === "") {
          return;
        }

        const currentActive = $tocLink[currentIndex];
        currentActive.classList.add("active");

        setTimeout(() => {
          autoScrollToc(currentActive);
        }, 0);

        if (isExpand) return;
        let parent = currentActive.parentNode;

        for (; !parent.matches(".toc"); parent = parent.parentNode) {
          if (parent.matches("li")) parent.classList.add("active");
        }
      }
    };

    // main of scroll
    window.tocScrollFn = anzhiyu.throttle(() => {
      const currentTop = window.scrollY || document.documentElement.scrollTop;
      findHeadPosition(currentTop);
    }, 96);

    window.addEventListener("scroll", tocScrollFn);
  };

  /**
   * Rightside
   */
  const rightSideFn = {
    switchReadMode: () => {
      // read-mode
      const $body = document.body;
      $body.classList.add("read-mode");
      const newEle = document.createElement("button");
      newEle.type = "button";
      newEle.className = "anzhiyufont anzhiyu-icon-sign-out-alt exit-readmode";
      $body.appendChild(newEle);

      function clickFn() {
        $body.classList.remove("read-mode");
        newEle.remove();
        newEle.removeEventListener("click", clickFn);
      }

      newEle.addEventListener("click", clickFn);
    },
    showOrHideBtn: e => {
      // rightside 點選設定 按鈕 展開
      const rightsideHideClassList = document.getElementById("rightside-config-hide").classList;
      rightsideHideClassList.toggle("show");
      if (e.classList.contains("show")) {
        rightsideHideClassList.add("status");
        setTimeout(() => {
          rightsideHideClassList.remove("status");
        }, 300);
      }
      e.classList.toggle("show");
    },
    scrollToTop: () => {
      // Back to top
      anzhiyu.scrollToDest(0, 500);
    },
    hideAsideBtn: () => {
      // Hide aside
      const $htmlDom = document.documentElement.classList;
      $htmlDom.contains("hide-aside")
        ? saveToLocal.set("aside-status", "show", 2)
        : saveToLocal.set("aside-status", "hide", 2);
      $htmlDom.toggle("hide-aside");
    },
    switchConsole: () => {
      // switch console
      const consoleEl = document.getElementById("console");
      //初始化隱藏邊欄
      const $htmlDom = document.documentElement.classList;
      $htmlDom.contains("hide-aside")
        ? document.querySelector("#consoleHideAside").classList.add("on")
        : document.querySelector("#consoleHideAside").classList.remove("on");
      if (consoleEl.classList.contains("show")) {
        consoleEl.classList.remove("show");
      } else {
        consoleEl.classList.add("show");
      }
      const consoleKeyboard = document.querySelector("#consoleKeyboard");
      if (consoleKeyboard) {
        if (localStorage.getItem("keyboardToggle") === "true") {
          consoleKeyboard.classList.add("on");
          anzhiyu_keyboard = true;
        } else {
          consoleKeyboard.classList.remove("on");
          anzhiyu_keyboard = false;
        }
      }
    },

    runMobileToc: () => {
      if (window.getComputedStyle(document.getElementById("card-toc")).getPropertyValue("opacity") === "0")
        window.mobileToc.open();
      else window.mobileToc.close();
    },
  };

  document.getElementById("rightside").addEventListener("click", function (e) {
    const $target = e.target.id ? e.target : e.target.parentNode;
    switch ($target.id) {
      case "go-up":
        rightSideFn.scrollToTop();
        break;
      case "rightside_config":
        rightSideFn.showOrHideBtn($target);
        break;
      case "mobile-toc-button":
        rightSideFn.runMobileToc();
        break;
      case "readmode":
        rightSideFn.switchReadMode();
        break;
      case "darkmode":
        anzhiyu.switchDarkMode();
        break;
      case "hide-aside-btn":
        rightSideFn.hideAsideBtn();
        break;
      case "center-console":
        rightSideFn.switchConsole();
        break;
      default:
        break;
    }
  });

  //監聽蒙版關閉
  document.addEventListener(
    "touchstart",
    e => {
      anzhiyu.removeRewardMask();
    },
    { passive: true }
  );

  /**
   * menu
   * 側邊欄sub-menu 展開/收縮
   */
  const clickFnOfSubMenu = () => {
    document.querySelectorAll("#sidebar-menus .site-page.group").forEach(function (item) {
      item.addEventListener("click", function () {
        this.classList.toggle("hide");
      });
    });
  };

  /**
   * 複製時加上版權資訊
   */
  const addCopyright = () => {
    const copyright = GLOBAL_CONFIG.copyright;
    document.body.oncopy = e => {
      e.preventDefault();
      let textFont;
      const copyFont = window.getSelection(0).toString();
      if (copyFont.length > copyright.limitCount) {
        textFont =
          copyFont +
          "\n" +
          "\n" +
          "\n" +
          copyright.languages.author +
          "\n" +
          copyright.languages.link +
          window.location.href +
          "\n" +
          copyright.languages.source +
          "\n" +
          copyright.languages.info;
      } else {
        textFont = copyFont;
      }
      if (e.clipboardData) {
        return e.clipboardData.setData("text", textFont);
      } else {
        return window.clipboardData.setData("text", textFont);
      }
    };
  };

  /**
   * 網頁執行時間
   */
  const addRuntime = () => {
    const $runtimeCount = document.getElementById("runtimeshow");
    if ($runtimeCount) {
      const publishDate = $runtimeCount.getAttribute("data-publishDate");
      $runtimeCount.innerText = anzhiyu.diffDate(publishDate) + " " + GLOBAL_CONFIG.runtime;
    }
  };

  /**
   * 最後一次更新時間
   */
  const addLastPushDate = () => {
    const $lastPushDateItem = document.getElementById("last-push-date");
    if ($lastPushDateItem) {
      const lastPushDate = $lastPushDateItem.getAttribute("data-lastPushDate");
      $lastPushDateItem.innerText = anzhiyu.diffDate(lastPushDate, true);
    }
  };

  /**
   * table overflow
   */
  const addTableWrap = () => {
    const $table = document.querySelectorAll("#article-container :not(.highlight) > table, #article-container > table");
    if ($table.length) {
      $table.forEach(item => {
        anzhiyu.wrap(item, "div", { class: "table-wrap" });
      });
    }
  };

  /**
   * tag-hide
   */
  const clickFnOfTagHide = function () {
    const $hideInline = document.querySelectorAll("#article-container .hide-button");
    if ($hideInline.length) {
      $hideInline.forEach(function (item) {
        item.addEventListener("click", function (e) {
          const $this = this;
          $this.classList.add("open");
          const $fjGallery = $this.nextElementSibling.querySelectorAll(".fj-gallery");
          $fjGallery.length && anzhiyu.initJustifiedGallery($fjGallery);
        });
      });
    }
  };

  const tabsFn = {
    clickFnOfTabs: function () {
      document.querySelectorAll("#article-container .tab > button").forEach(function (item) {
        item.addEventListener("click", function (e) {
          const $this = this;
          const $tabItem = $this.parentNode;

          if (!$tabItem.classList.contains("active")) {
            const $tabContent = $tabItem.parentNode.nextElementSibling;
            const $siblings = anzhiyu.siblings($tabItem, ".active")[0];
            $siblings && $siblings.classList.remove("active");
            $tabItem.classList.add("active");
            const tabId = $this.getAttribute("data-href").replace("#", "");
            const childList = [...$tabContent.children];
            childList.forEach(item => {
              if (item.id === tabId) item.classList.add("active");
              else item.classList.remove("active");
            });
            const $isTabJustifiedGallery = $tabContent.querySelectorAll(`#${tabId} .fj-gallery`);
            if ($isTabJustifiedGallery.length > 0) {
              anzhiyu.initJustifiedGallery($isTabJustifiedGallery);
            }
          }
        });
      });
    },
    backToTop: () => {
      document.querySelectorAll("#article-container .tabs .tab-to-top").forEach(function (item) {
        item.addEventListener("click", function () {
          anzhiyu.scrollToDest(anzhiyu.getEleTop(anzhiyu.getParents(this, ".tabs")) - 60, 300);
        });
      });
    },
  };

  const toggleCardCategory = function () {
    const $cardCategory = document.querySelectorAll("#aside-cat-list .card-category-list-item.parent i");
    if ($cardCategory.length) {
      $cardCategory.forEach(function (item) {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const $this = this;
          $this.classList.toggle("expand");
          const $parentEle = $this.parentNode.nextElementSibling;
          if (anzhiyu.isHidden($parentEle)) {
            $parentEle.style.display = "block";
          } else {
            $parentEle.style.display = "none";
          }
        });
      });
    }
  };

  const switchComments = function () {
    let switchDone = false;
    const $switchBtn = document.querySelector("#comment-switch > .switch-btn");
    $switchBtn &&
      $switchBtn.addEventListener("click", function () {
        this.classList.toggle("move");
        document.querySelectorAll("#post-comment > .comment-wrap > div").forEach(function (item) {
          if (anzhiyu.isHidden(item)) {
            item.style.cssText = "display: block;animation: tabshow .5s";
          } else {
            item.style.cssText = "display: none;animation: ''";
          }
        });

        if (!switchDone && typeof loadOtherComment === "function") {
          switchDone = true;
          loadOtherComment();
        }
      });
  };

  const addPostOutdateNotice = function () {
    const data = GLOBAL_CONFIG.noticeOutdate;
    const diffDay = anzhiyu.diffDate(GLOBAL_CONFIG_SITE.postUpdate);
    if (diffDay >= data.limitDay) {
      const ele = document.createElement("div");
      ele.className = "post-outdate-notice";
      ele.innerHTML = `${data.messagePrev} <strong style="color: #f66;">${diffDay}</strong> ${data.messageNext}`;
      const $targetEle = document.getElementById("article-container");
      if (data.position === "top") {
        $targetEle.insertBefore(ele, $targetEle.firstChild);
      } else {
        $targetEle.appendChild(ele);
      }
    }
  };

  const lazyloadImg = () => {
    window.lazyLoadInstance = new LazyLoad({
      elements_selector: "img",
      threshold: 0,
      data_src: "lazy-src",
    });
  };

  const relativeDate = function (selector) {
    selector.forEach(item => {
      const $this = item;
      const timeVal = $this.getAttribute("datetime");
      $this.innerText = anzhiyu.diffDate(timeVal, true);
      $this.style.display = "inline";
    });
  };

  const mouseleaveHomeCard = function () {
    const topGroup = document.querySelector(".topGroup");
    if (!topGroup) return;
    //首頁大卡片恢復顯示
    topGroup.addEventListener("mouseleave", function () {
      document.getElementById("todayCard").classList.remove("hide");
      document.getElementById("todayCard").style.zIndex = 1;
    });
  };

  // 表情放大
  const owoBig = function () {
    let flag = 1, // 設定節流閥
      owo_time = "", // 設定計時器
      m = 3; // 設定放大倍數
    // 建立盒子
    let div = document.createElement("div");
    // 設定ID
    div.id = "owo-big";
    // 插入盒子
    let body = document.querySelector("body");
    body.appendChild(div);

    // 監聽 post-comment 元素的子元素新增事件
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const addedNodes = mutation.addedNodes;
        // 判斷新增的節點中是否包含 OwO-body 類名的元素
        for (let i = 0; i < addedNodes.length; i++) {
          const node = addedNodes[i];
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("OwO-body") &&
            !node.classList.contains("comment-barrage")
          ) {
            const owo_body = node;
            // 禁用右鍵（手機端長按會出現右鍵選單，為了體驗給禁用掉）
            owo_body.addEventListener("contextmenu", e => e.preventDefault());
            // 滑鼠移入
            owo_body.addEventListener("mouseover", handleMouseOver);
            // 滑鼠移出
            owo_body.addEventListener("mouseout", handleMouseOut);
          }
        }
      });
    });

    // 配置 MutationObserver 選項
    const config = { childList: true, subtree: true };

    // 開始監聽
    observer.observe(document.getElementById("post-comment"), config);

    function handleMouseOver(e) {
      if (e.target.tagName == "IMG" && flag) {
        flag = 0;
        // 移入100毫秒後顯示盒子
        owo_time = setTimeout(() => {
          let height = e.target.clientHeight * m; // 盒子高
          let width = e.target.clientWidth * m; // 盒子寬
          let left = e.x - e.offsetX - (width - e.target.clientWidth) / 2; // 盒子與螢幕左邊距離
          if (left + width > body.clientWidth) {
            left -= left + width - body.clientWidth + 10;
          } // 右邊緣檢測，防止超出螢幕
          if (left < 0) left = 10; // 左邊緣檢測，防止超出螢幕
          let top = e.y - e.offsetY; // 盒子與螢幕頂部距離

          // 設定盒子樣式
          div.style.height = height + "px";
          div.style.width = width + "px";
          div.style.left = left + "px";
          div.style.top = top + "px";
          div.style.display = "flex";
          // 在盒子中插入圖片
          div.innerHTML = `<img src="${e.target.src}">`;
        }, 100);
      }
    }

    function handleMouseOut(e) {
      // 隱藏盒子
      div.style.display = "none";
      flag = 1;
      clearTimeout(owo_time);
    }
  };

  //封面純色
  const coverColor = () => {
    const root = document.querySelector(":root");
    const path = document.getElementById("post-top-bg")?.src;

    if (!path) {
      root.style.setProperty("--anzhiyu-bar-background", "var(--anzhiyu-meta-theme-color)");
      anzhiyu.initThemeColor();

      if (GLOBAL_CONFIG.changeMainColorPost) {
        document.documentElement.style.setProperty(
          "--anzhiyu-main",
          getComputedStyle(document.documentElement).getPropertyValue("--anzhiyu-theme")
        );
      }

      return;
    }

    if (!GLOBAL_CONFIG.changeMainColorPost) {
      root.style.setProperty("--anzhiyu-bar-background", "var(--anzhiyu-theme)");
      anzhiyu.initThemeColor();
      return
    }
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", `${path}?imageAve`, true);
    httpRequest.send();

    httpRequest.onreadystatechange = () => {
      const isRequestCompleted = httpRequest.readyState === 4;
      const isSuccess = isRequestCompleted && httpRequest.status === 200;

      let value;

      if (isSuccess) {
        try {
          const obj = JSON.parse(httpRequest.responseText);
          value = "#" + obj.RGB.slice(2);

          if (getContrastYIQ(value) === "light") {
            value = LightenDarkenColor(colorHex(value), -40);
          }
        } catch (err) {
          value = "var(--anzhiyu-theme)";
        }
      } else if (isRequestCompleted) {
        value = "var(--anzhiyu-theme)";
      }

      if (value) {
        root.style.setProperty("--anzhiyu-bar-background", value);
        anzhiyu.initThemeColor();
        if (GLOBAL_CONFIG.changeMainColorPost) {
          document.documentElement.style.setProperty("--anzhiyu-main", value);
        }
      }
    };
  };

  //RGB顏色轉化為16進位制顏色
  const colorHex = str => {
    const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    if (/^(rgb|RGB)/.test(str)) {
      const aColor = str.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      return aColor.reduce((acc, val) => {
        const hex = Number(val).toString(16).padStart(2, "0");
        return acc + hex;
      }, "#");
    }

    if (hexRegex.test(str)) {
      if (str.length === 4) {
        return Array.from(str.slice(1)).reduce((acc, val) => acc + val + val, "#");
      }
      return str;
    }

    return str;
  };

  //16進位制顏色轉化為RGB顏色
  const colorRgb = str => {
    const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    let sColor = str.toLowerCase();

    if (sColor && hexRegex.test(sColor)) {
      if (sColor.length === 4) {
        sColor = Array.from(sColor.slice(1)).reduce((acc, val) => acc + val + val, "#");
      }

      const sColorChange = Array.from({ length: 3 }, (_, i) => parseInt(sColor.slice(i * 2 + 1, i * 2 + 3), 16));

      return `rgb(${sColorChange.join(",")})`;
    }

    return sColor;
  };

  // Lighten or darken a color
  const LightenDarkenColor = (col, amt) => {
    const usePound = col.startsWith("#");

    if (usePound) {
      col = col.slice(1);
    }

    let num = parseInt(col, 16);

    const processColor = (colorValue, amount) => {
      colorValue += amount;
      return colorValue > 255 ? 255 : colorValue < 0 ? 0 : colorValue;
    };

    const r = processColor(num >> 16, amt);
    const b = processColor((num >> 8) & 0x00ff, amt);
    const g = processColor(num & 0x0000ff, amt);

    return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
  };

  // Determine whether a color is light or dark
  const getContrastYIQ = hexcolor => {
    const colorRgb = color => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      color = color.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
    };

    const colorrgb = colorRgb(hexcolor);
    const colors = colorrgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    const [_, red, green, blue] = colors;

    const brightness = (red * 299 + green * 587 + blue * 114) / 255000;

    return brightness >= 0.5 ? "light" : "dark";
  };

  //監聽跳轉頁面輸入框是否按下回車
  const listenToPageInputPress = function () {
    var input = document.getElementById("toPageText");
    if (input) {
      input.addEventListener("keydown", event => {
        if (event.keyCode === 13) {
          // 如果按下的是回車鍵，則執行特定的函式
          anzhiyu.toPage();
          var link = document.getElementById("toPageButton");
          var href = link.href;
          pjax.loadUrl(href);
        }
      });
    }
  };

  // 監聽nav是否被其他音訊暫停⏸️
  const listenNavMusicPause = function () {
    const timer = setInterval(() => {
      if (navMusicEl.querySelector("#nav-music meting-js").aplayer) {
        clearInterval(timer);
        let msgPlay = '<i class="anzhiyufont anzhiyu-icon-play"></i><span>播放音樂</span>';
        let msgPause = '<i class="anzhiyufont anzhiyu-icon-pause"></i><span>暫停音樂</span>';
        navMusicEl.querySelector("#nav-music meting-js").aplayer.on("pause", function () {
          navMusicEl.classList.remove("playing");
          document.getElementById("menu-music-toggle").innerHTML = msgPlay;
          document.getElementById("nav-music-hoverTips").innerHTML = "音樂已暫停";
          document.querySelector("#consoleMusic").classList.remove("on");
          anzhiyu_musicPlaying = false;
          navMusicEl.classList.remove("stretch");
        });
        navMusicEl.querySelector("#nav-music meting-js").aplayer.on("play", function () {
          navMusicEl.classList.add("playing");
          document.getElementById("menu-music-toggle").innerHTML = msgPause;
          document.querySelector("#consoleMusic").classList.add("on");
          anzhiyu_musicPlaying = true;
          // navMusicEl.classList.add("stretch");
        });
      }
    }, 16);
  };

  // 開發者工具鍵盤監聽
  window.onkeydown = function (e) {
    123 === e.keyCode && anzhiyu.snackbarShow("開發者模式已開啟，請遵循GPL協議", !1);
  };

  const unRefreshFn = function () {
    window.addEventListener("resize", () => {
      adjustMenu(false);
      anzhiyu.isHidden(document.getElementById("toggle-menu")) && mobileSidebarOpen && sidebarFn.close();
    });


    anzhiyu.darkModeStatus();

    document.getElementById("menu-mask").addEventListener("click", e => {
      sidebarFn.close();
    });
    GLOBAL_CONFIG.islazyload && lazyloadImg();
    GLOBAL_CONFIG.copyright !== undefined && addCopyright();
    GLOBAL_CONFIG.navMusic && listenNavMusicPause();
    clickFnOfSubMenu();
  };

  window.refreshFn = function () {
    initAdjust();

    if (GLOBAL_CONFIG_SITE.isPost) {
      GLOBAL_CONFIG.noticeOutdate !== undefined && addPostOutdateNotice();
      GLOBAL_CONFIG.relativeDate.post && relativeDate(document.querySelectorAll("#post-meta time"));
    } else {
      GLOBAL_CONFIG.relativeDate.homepage && relativeDate(document.querySelectorAll("#recent-posts time"));
      GLOBAL_CONFIG.runtime && addRuntime();
      addLastPushDate();
      toggleCardCategory();
    }

    scrollFnToDo();
    GLOBAL_CONFIG_SITE.isHome && scrollDownInIndex();
    addHighlightTool();
    GLOBAL_CONFIG.isPhotoFigcaption && addPhotoFigcaption();
    scrollFn();

    // 刷新时第一次滚动百分比
    window.scrollCollect && window.scrollCollect();

    const $jgEle = document.querySelectorAll("#content-inner .fj-gallery");
    $jgEle.length && runJustifiedGallery($jgEle);

    runLightbox();
    addTableWrap();
    clickFnOfTagHide();
    tabsFn.clickFnOfTabs();
    tabsFn.backToTop();
    switchComments();
    document.getElementById("toggle-menu").addEventListener("click", () => {
      sidebarFn.open();
    });

    // 如果當前頁有留言就執行函式
    if (document.getElementById("post-comment")) owoBig();

    mouseleaveHomeCard();
    coverColor();
    listenToPageInputPress();
  };

  refreshFn();
  unRefreshFn();
});
