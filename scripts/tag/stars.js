/**
 * stars
 */

"use strict";

const urlFor = require("hexo-util").url_for.bind(hexo);

const starsFn = (args, content) => {
  content = hexo.render.renderSync({ text: content, engine: "yaml" });

  let result = "";

  content.forEach(i => {
    const className = i.class_name ? `<div class="stars-name">${i.class_name}</div>` : "";
    const classDesc = i.class_desc ? `<div class="stars-desc">${i.class_desc}</div>` : "";

    let listResult = "";
    let listContainerClass = "";
    if (i.stars_style === "anzhiyu") {
      listContainerClass = "anzhiyu-stars-list";
      i.link_list.forEach(j => {
        listResult += `
            <div class="stars-list-item">
              <a href="${j.link}" title="${j.name}" class="stars-link" target="_blank">
                <div class="stars-item-icon">
                  <img class="no-lightbox stars-avatar" src="${
                    j.avatar
                  }" onerror='this.onerror=null;this.src="${urlFor(hexo.theme.config.error_img.stars)}"' alt="${
          j.name
        }" />
                </div>
                <div class="stars-item-info">
                  <div class="stars-item-name">${j.name}</div>
                  <div class="stars-item-desc" title="${j.descr}">${j.descr}</div>
                </div>
              </a>
            </div>`;
      });
    } else {
      listContainerClass = "flexcard-stars-list";
      i.link_list.forEach(j => {
        listResult += `
              <a href="${j.link}" title="${j.name}" target="_blank" class="stars-list-card stars-link">
                <div class="wrapper cover">
                    <img class="no-lightbox cover fadeIn" src="${
                      j.siteshot
                    }" onerror='this.onerror=null;this.src="${urlFor(hexo.theme.config.error_img.stars)}"' alt="${
          j.name
        }" />
                </div>
                <div class="info">
                  <img class="no-lightbox stars-avatar stars-avatar" src="${
                    j.avatar
                  }" onerror='this.onerror=null;this.src="${urlFor(hexo.theme.config.error_img.stars)}"' alt="${
          j.name
        }"/>

                  <span class="stars-sitename stars-name">${j.name}</span>
                </div>
              </a>`;
      });
    }

    result += `${className}${classDesc} <div class="stars-list"><div class="${listContainerClass}">${listResult}</div></div>`;
  });

  return `<div class="stars">${result}</div>`;
};

hexo.extend.tag.register("stars", starsFn, { ends: true });
