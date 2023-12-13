const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const closeModal = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEL = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');


let bookmarks =[];

// show modal 
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

modalShow.addEventListener('click', showModal);
closeModal.addEventListener('click' , () => modal.classList.remove('show-modal'));
window.addEventListener('click' , (e) => e.target === modal ? modal.classList.remove('show-modal') : false)

function validate(nameValue , urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if(!nameValue || !urlValue){
        alert('please submit value for both inputs');
        return false;
    }

    if(!urlValue.match(regex)){
        alert('please provide a valid web address');
        return false;
    }

    return true
}

function buildBookmarks() {

    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark) => {
        const {name , url} = bookmark;
        const item = document.createElement('div');
        item.classList.add('item');

        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid' , 'fa-xmark');
        closeIcon.setAttribute('title' , 'Delete Bookmark');
        closeIcon.setAttribute('onclick' , `deleteBookmark('${url}')`);
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    })
}


// fetch bookmarks

function fetchBookmarks() {
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name : "test",
                url : 'url.com',
            },
        ];
        localStorage.setItem('bookmarks' , JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url) {
    // Loop through the bookmarks array
    bookmarks.forEach((bookmark, i) => {
      if (bookmark.url === url) {
        bookmarks.splice(i, 1);
      }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
  }

function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEL.value;
    if((!urlValue.includes('http://') ) && (!urlValue.includes('https://'))){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue , urlValue)) {
        return false;
    }

    const  bookmark = {
        name : nameValue,
        url : urlValue,
    }

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks' , JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

bookmarkForm.addEventListener('submit' , storeBookmark);

// on load fetch
fetchBookmarks()