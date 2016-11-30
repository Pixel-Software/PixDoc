//==--- DoxyFormat/Js/DoxyFormat.js ----------------------- -*- C++ -*- ---==//
//
//                                Pixel : DoxyFormat
//
//                  Copyright (c) 2016 Pixel Technologies, Ltd.
//
//  This file is distributed under the MIT License. See LICENSE for details. 
//
//==-----------------------------------------------------------------------==//
//
/// File          : DoxyFormat.js
/// Description   : Provides functionality for formatting doxygen output to use
//                  a pixel-modified version of materialize css when follows
//                  the formatting of the rest of the internal documentation.
//
//==-----------------------------------------------------------------------==//

var mainHeading = "h2";
var subHeading  = "h3";

$(document).ready(function(){
  $('.button-collapse').sideNav();
  $('.scrollspy').scrollSpy();
  $('.collapsible').collapsible();

  $('.button-collapse').on('click', function(){
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      $('.site-content').removeClass('shift-right');
    } else {
      $(this).addClass('active');
      $('.site-content').addClass('shift-right');
    }
  });


  //==---  Modifications to doxygen: --------------------------------------==//
  
  $('table').addClass('highlighted');
  $('table.directory').removeClass('directory');

  $('div.header').remove();
  var navRow1  = document.getElementById('navrow1'); 
  var navRow2  = document.getElementById('navrow2'); 
  var navRow3  = document.getElementById('navrow3'); 
  var navRow4  = document.getElementById('navrow4'); 
  var mainNav  = document.getElementById('main-nav');
  var navPath  = document.getElementById('nav-path');
  if (navRow1 != null) { navRow1.outerHTML = ""; }
  if (navRow2 != null) { navRow2.outerHTML = ""; }
  if (navRow3 != null) { navRow3.outerHTML = ""; }
  if (navRow4 != null) { navRow4.outerHTML = ""; }
  if (mainNav != null) { mainNav.outerHTML = ""; }
  if (navPath != null) { navPath.outerHTML = ""; }

  // Current page we're on:
  var currentUrl = window.location.href.split('/').pop();

  // Remove doxygen search:
  document.getElementById('MSearchResultsWindow').outerHTML = "";
  document.getElementById('MSearchSelectWindow').outerHTML  = "";

  // Remove levels:
  $('.levels').remove();

  // Remove doxygen text block and add our own contents:
  $('.textblock').removeClass('textblock');
  $('.contents').addClass("col s12 m8 l6 z-depth-2");
  $('.contents').wrap("<div class='row'></div>");
  $('.contents').before("<div class='col s0 m2 l3'></div>");
  $('.contents').prepend(
    "<div class='row'>"                                                        +
      "<div class='col s12'>"                                                  +
        "<ul class='tabs z-depth-1'>"                                          +
          "<li class='tab col s3'><a href='index.html'>Meta</a></li>"          +
          "<li class='tab col s3'><a href='files.html'>Files</a></li>"         +
          "<li class='tab col s3'><a href='hierarchy.html'>Classes</a></li>"   +
          "<li class='tab col s3'><a href='annotated.html'>Namespaces</a></li>"+
        "</ul>"                                                                +
      "</div>"                                                                 +
    "</div>");
  $('.contents').after("<div id='tabofcontents' class='col s0 m2 l3'></div>");
 
  //==--- Files Modifications ---------------------------------------------==//

  // Modifications for the file link:
  if (currentUrl == "files.html") {
    $('.iconfopen').addClass('material-icons');
    $('.iconfopen').addClass('iconlink');
    $('.iconfopen').text("folder");
    $('.iconfopen').removeClass("iconfopen");
    $('a.el').addClass('tablelink');

    $('.icondoc').addClass('material-icons');
    $('.icondoc').addClass('iconlink');
    $('.icondoc').text('description');
    $('.icondoc').removeClass('icondoc');

    $('td.entry').addClass('pixelentry');
    $('td.entry').removeClass('entry');
  }

  //==--- Structured Modifications ----------------------------------------==//

  if (currentUrl == "annotated.html") {
    $('.icona').addClass('material-icons'); 
    $('.icona').addClass('iconlink'); 
    $('.icona').text('menu');
    $('.icona').removeClass("icona");
    $('a.el').addClass('tablelink');
    $('b').addClass('tablelink');

    $('td.entry').addClass('pixelentry');
    $('td.entry').removeClass('entry');
  }

  //==-- Classes Modifications --------------------------------------------==//

  $('.directory').wrap("<div class='row'></div>");
  $('.directory').wrap("<div class='col s12'></div>");
  $('.fragment').wrap("<div class='row'></div>");
  $('.fragment').wrap("<div class='col s12'></div>");
  $('.fragment').wrap("<div class='language-cpp highlighter-rouge'>");
  $('.fragment').wrap("<pre class='highlight'></pre>");
  $('.fragment').wrap("<code></code>");
  $('.fragment').removeClass('fragment');

  $('.comment').addClass('c1').removeClass('comment');
  $('.keyword').addClass('k').removeClass('keyword');
  $('.preprocessor').addClass('cp').removeClass('preprocessor');
  $('.keywordtype').addClass('kt').removeClass('keywordtype');
  $('a.code').addClass('newcode').removeClass('code');
  $('a.line').addClass('newline').removeClass('line');
  $('.ttc').remove();
  
  var codeBlock = $('.code');

  if (currentUrl == "hierarchy.html") {
    // We transform the table into cards:
    var rows = document.getElementsByTagName("table")[0].rows;
    var refs = [];
    for (var i = 0; i < rows.length; i++) {
      var reference = rows[i].cells[0];
      var desc      = rows[i].cells[1];
      var nspace    = "", name = "", link = "", descrip = "";
  
      // Check name and ref element is valid:
      if (reference.childNodes[2] != null) {
        if (desc.innerText != null) {
          descrip = desc.innerText;
        }

        name = reference.childNodes[2].innerText;
        link = reference.childNodes[2].href;

        // Create the name and namespace:
        var startIdx = 0, scopeIdx = 0, failsafe = 0, failsafeMax = 100;
        while (name.substring(startIdx).indexOf("::") != -1 && 
               failsafe++ < failsafeMax) {
          scopeIdx = name.substring(startIdx).indexOf('::') + startIdx + 2;

          // Search for scope resolution in a template:
          // This will probably need to be updated to handle cases like:
          //  Something::Other< NSOne::NSTwo::
          var isTemplate = false;
          if (name.substring(startIdx, scopeIdx - 2).search('<') != -1 ) {
            isTemplate = true;
          }

          // Check for special characters:
          // Class<RType(OClass::*)Args...>
          if (scopeIdx < name.length && !isTemplate &&
              name[scopeIdx].match(/^[a-zA-Z]/) != null) {
            nspace  += name.substring(0, scopeIdx);
            name     = name.substring(scopeIdx);
            startIdx = 0;
          } else {
            startIdx += scopeIdx;
          }
        }

        // Sometimes there are errors,  but when they turn up they always
        // have no namespace. Since we know our code ALWAYS has a score of
        // some sort, we can just remove them:
        if (nspace != "") {
          refs.push({ "name"        : name                                  ,
                      "namespace"   : nspace.substring(0, nspace.length - 2), 
                      "link"        : link                                  ,
                      "desc"        : descrip                               });
        }
      }
    }

    // Sort alphabetically:
    refs.sort(function(a, b) {
      if (a.name > b.name) return  1;
      if (a.name < b.name) return -1;
      return 0;
    });

    var newClassTable = "<div class='row'><div class='col s12'>";
    refs.forEach(function(data) {
      newClassTable +=
        "<div class='card z-depth-3'>"                                   +
          "<div class='card-content'>"                                   + 
              "<a class='card-title' href='"                             +
              data.link + "'>" + data.name + " (" + data.namespace + ")" +
              "</a>"                                                     +
          "</div>"                                                       +
          "<div class='card-action'>"                                    +
            "<p class='pcardaction'>" + data.desc + "</p>"               +
          "</div>"                                                       +
        "</div>";
    });
    newClassTable += "</div></div>";
    document.getElementsByTagName("table")[0].outerHTML = newClassTable;
  }

  //==--- Detailed Modifications ------------------------------------------==//

  if (currentUrl.search("struct") != -1 || 
      currentUrl.search("class")  != -1 ||
      currentUrl.search("hpp")    != -1 ||
      currentUrl.search("cpp")    != -1) {
   
    $('table.memname.highlighted').removeClass('highlighted');
    $('table.mlabels.highlighted').removeClass('highlighted');

    $('.table').each(function() {
      var table = $(this);
      var removable = table.hasClass('memname') || table.hasClass('mlabels');
      if (removable && table.hasClass('highlighted')) {
        table.removeClass('highlighted');
      }
    });

    var header   = $('h3');
    var elements = header.nextUntil('h2');
    header.addClass('doxyH3');

    if (header.length > 0) {
      // Make a card:
      var newCard = 
          "<div class='card z-depth-3'>"                                   +
            "<div class='card-content'>"                                   +
                "<span class='bold-card-title card-title'>"                +
                  header[0].innerHTML                                      +
                "</span>"                                                  +
            "</div>"                                                       +
            "<div class='card-action'>";

      // For each of the elements, add them to the card action:
      for (var i = 0 ; i < elements.length; i++) {
        newCard += elements[i].outerHTML;
      }
      newCard += "</div></div>";
      header[0].parentElement.outerHTML = newCard;
    }

    $('a.el').addClass('tablelink');

    var item, memproto;
    $('.memitem').each(function() {
      item = $(this);
      item.addClass('card').addClass('.z-depth-1');
      
      item.children('.memproto').each(function() {
        $(this).addClass('bold-card-title').addClass('card-title');
        $(this).removeClass('memproto');
      });
      item.removeClass('memitem');
    });

    $('.memdoc').each(function() {
      item = $(this);
      item.addClass('card-action');
      item.removeClass('memdoc');
    });

    $('.memtitle').each(function() {
      (this).remove();
    });
  }

  //== Enumerations -------------------------------------------------------==//
  
  $('.fieldtable').each(function() {
    var elem = $(this);
    if (elem.hasClass('highlighted')) {
      elem.removeClass('highlighted');
    }
    elem.addClass('striped');
    elem.removeClass('fieldtable');
  }

  //== Table of Contents --------------------------------------------------==//

  var tableOfContents = 
    "<ul id='tocscroll' class='collapsible popout table-of-contents'" + 
    "data-collapsible='accordion'>";

  var element,  // The element we are looking at.
      title  ,  // The element's title.
      link   ;  // The element's link.
  $(mainHeading).each(function() {
    element = $(this);
    title   = element.text();
    link    = "#" + element.attr("id");

    newLine =
      "<li><div class='collapsible-header z-depth-1'><a href='" + 
      link + "'>" + title + "</a></div>"                        +
      "<div class='collapsible-body'><ul>";

    // Search through the next bit of the content and check if we find som sub
    // headers we should add:
    var contents = $(this).nextUntil(mainHeading).text();
    $(subHeading).each(function() { 
      subtitle = $(this).text();
      if (contents.search(subtitle) != -1) {
        sublink  = "#" + $(this).attr("id");
        newLine += "<li><a href='" + sublink + "'>" + subtitle + "</a></li>";
      }
    });

    newLine         += "</ul></div></li>";
    tableOfContents += newLine
  });

  tableOfContents += "</ul>";

  // Add the built table of contents to the table of contents div:
  var toc = document.getElementById("tabofcontents");
  toc.innerHTML = tableOfContents;

  // Set properties of the TOC widget:
  document.getElementById("tocscroll").style.position  = "fixed";
  document.getElementById("tocscroll").style.width     = "17%";
  document.getElementById("tocscroll").style.marginTop = "3%";

  // Initialize the added elements:
  $('.collapsible').collapsible();
});

$(document.body).click(function() {
  if ($('.button-collapse').hasClass('active')) {
    $('.button-collapse').removeClass('active');
    $('.site-content').removeClass('shift-right');
  }
});
     
