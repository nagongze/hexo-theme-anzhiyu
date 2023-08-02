/**
 * mmdcollect
 */

"use strict";

const urlFor = require("hexo-util").url_for.bind(hexo);

const mmdcollectFn = (args, content) => {
  content = hexo.render.renderSync({ text: content, engine: "yaml" });

  let result = "";

  content.forEach(i => {
    const className = i.class_name ? `<div class="mmdcollect-name">${i.class_name}</div>` : "";
    const classDesc = i.class_desc ? `<div class="mmdcollect-desc">${i.class_desc}</div>` : "";

    let listResult = "";
    let listContainerClass = "";
    if (i.mmdcollect_style === "anzhiyu") {
      listContainerClass = "anzhiyu-mmdcollect-list";
      i.link_list.forEach(j => {
        listResult += `
            <div class="mmdcollect-list-item">
              <a href="${j.link}" title="${j.name}" class="mmdcollect-link" target="_blank">
                <div class="mmdcollect-item-icon">
                  <img class="no-lightbox mmdcollect-avatar" src="${
                    j.avatar
                  }" onerror='this.onerror=null;this.src="${urlFor(hexo.theme.config.error_img.mmdcollect)}"' alt="${
          j.name
        }" />
                </div>
                <div class="mmdcollect-item-info">
                  <div class="mmdcollect-item-name">${j.name}</div>
                  <div class="mmdcollect-item-desc" title="${j.descr}">${j.descr}</div>
                </div>
              </a>
            </div>`;
      });
    } else {
      listContainerClass = "flexcard-mmdcollect-list";
      i.link_list.forEach(j => {
        listResult += `
              <a href="${j.link}" title="${j.name}" target="_blank" class="mmdcollect-list-card mmdcollect-link">
                <div class="wrapper cover">
                    <img class="no-lightbox cover fadeIn" src="${
                      j.siteshot
                    }" onerror='this.onerror=null;this.src="${urlFor(hexo.theme.config.error_img.mmdcollect)}"' alt="${
          j.name
        }" />
                </div>
                <div class="info">
                  <img class="no-lightbox mmdcollect-avatar mmdcollect-avatar" src="${
                    j.avatar
                  }" onerror='this.onerror=null;this.src="${urlFor(hexo.theme.config.error_img.mmdcollect)}"' alt="${
          j.name
        }"/>

                  <span class="mmdcollect-sitename mmdcollect-name">${j.name}</span>
                </div>
              </a>`;
      });
    }

    result += `${className}${classDesc} <div class="mmdcollect-list"><div class="${listContainerClass}">${listResult}</div></div>`;
  });

  return `<div class="mmdcollect">${result}</div>`;
};

hexo.extend.tag.register("mmdcollect", mmdcollectFn, { ends: true });
