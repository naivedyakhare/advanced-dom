'use strict';

// IMP VARIABLES
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2')
const section3 = document.querySelector('#section--3')
const header = document.querySelector('.header');
const nav= document.querySelector('.nav')

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnstoggleModal = document.querySelectorAll('.btn--show-modal');

const toggleModal = function () {
  modal.classList.toggle('hidden');
  overlay.classList.toggle('hidden');
};

btnstoggleModal.forEach(btn => btn.addEventListener('click', toggleModal))  

btnCloseModal.addEventListener('click', toggleModal);
overlay.addEventListener('click', toggleModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    toggleModal();
  }
});

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = `Do you except the cookie ? <button class = "btn btn--close-cookie">Accept</button>`
// header.append(message)

// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.remove();
// })

// -- - -- -- - -- \\

const btnScroll = document.querySelector('.btn--scroll-to');

btnScroll.addEventListener('click', function(e) {
// window.scrollTo(
//   {
//     left: window.pageXOffset, 
//     top: pageYOffset + section1.getBoundingClientRect().top,

//     behavior: 'smooth'
//   });
  //We can or we cannot use the 'window' before pageX/YOffset
//window.pageYOffset is the pixels the page has already scrolled from the current position
//section1.getBoundingClientRect().top is the distance from top to the point where section1 starts. It is NOT the height from the top of the webpage but from top of the current window. So adding ~pageYOffset~ AND ~top~ will result in the exact position where the section1 starts from the top of the webpage and the function (window,scrollTo(x, y)) will transfer us to the exact position at which the section1 starts.

// -- OR YOU CAN DO THIS AN EASIER WAY -- \\
  section1.scrollIntoView({behavior: 'smooth'});
})


//  const btnScroll1 = document.querySelectorAll('.nav__link');

//  btnScroll1.forEach( function(navItem) {
//   navItem.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});

//   })
// })

const navEventHandler = document.querySelector('.nav__links');

navEventHandler.addEventListener('click', function(e) {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  e.target.className === 'nav__link' ? document.querySelector(id).scrollIntoView({behavior: 'smooth'}) : null;
})


const tabContainer = document.querySelector('.operations__tab-container');
const operationsTab = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function(e) {
  if(e.target != tabContainer) {
    
    e.preventDefault();

    const tabEvent = e.target.closest('.operations__tab');
    const tabNumber = tabEvent.dataset.tab;

    operationsTab.forEach( tabBtn => {
      //ACTIVATING BUTTON TAB
      tabBtn.classList.remove('operations__tab--active');
    })
    tabEvent.classList.add('operations__tab--active');
    //ACTIVATING CONTENT TAB
    tabContent.forEach((tabContent) => {
      if(tabContent.classList.contains(`operations__content--${tabNumber}`)) 
        tabContent.classList.add('operations__content--active');
      else 
        tabContent.classList.remove('operations__content--active');
    })
  }
})

const dynamicNav = function(opacity) {
  return function(e) {
    const allLinks = e.target.closest('.nav').querySelectorAll('.nav__link');  
    const logo = e.target.closest('.nav').querySelector('.nav__logo');
    
    if(e.target.classList.contains('nav__link')) {
      allLinks.forEach( child => {  
        if(child != e.target ) {
          child.style.opacity = opacity;
        }  
      })
      e.target.classList.contains('nav__link')
    }
  }
}

nav.addEventListener('mouseover', dynamicNav('0.5'));
nav.addEventListener('mouseout', dynamicNav('1'));


// STICKY NAVIGATION BAR -- 
//FIRST WAY --
// const navAppearPx = section1.getBoundingClientRect().top - parseInt(window.getComputedStyle(nav).height)+ window.pageYOffset;
// window.addEventListener('scroll', function() {
//   if( navAppearPx < window.pageYOffset) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// })


//BETTER WAY --
//INTERSECTION OBSERVER API --
const obsCallback = function(entries, observer) {
  entries.forEach(entry => {

    if(!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else{ 
      nav.classList.remove('sticky');
    }
  })  
}

const navHeight = nav.getBoundingClientRect().height;
const obsObject = {
  root: null,
  threshold: 0,
  rootMargin: -navHeight + 'px',
}
const observer = new IntersectionObserver(obsCallback, obsObject);
observer.observe(header);


// SECTION APPEAR ON SCROLL
const allSection = document.querySelectorAll('.section');
const sectionCallback = function(entries, observer) {
  entries.forEach(entry => {      
    if(entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target)
    }
  })
}
const sectionObj = {
  root: null,
  threshold: 0.15
}
const obsSection = new IntersectionObserver(sectionCallback, sectionObj);
allSection.forEach(section => {
  section.classList.add('section--hidden');
  obsSection.observe(section);
})

// LAZY LOADING --

const allImg = document.querySelectorAll('.features__img');
const imgCallback = function(entries, observer) {

  const [entry] = entries;
  if(entry.isIntersecting) {
    entry.target.setAttribute('src', entry.target.dataset.src);

    entry.target.addEventListener('load', function(e) {
      entry.target.classList.remove('lazy-img')
    })
    observer.unobserve(entry.target)
  }
}

const imgObj = {
  root: null,
  threshold: 0.1
}

const obsImg = new IntersectionObserver(imgCallback, imgObj)
allImg.forEach(img => {
  obsImg.observe(img);
})

// SLIDER -- --
let curSlide = 0;

const slideLeft = document.querySelector('.slider__btn--left');
const slideRight = document.querySelector('.slider__btn--right');
const allSlider = document.querySelectorAll('.slide');
const maxSlide = allSlider.length;
const dotContainer = document.querySelector('.dots');

// CREATING SLIDER DOTS
const createDots = function() {
  allSlider.forEach((_, i) => {
    dotContainer.insertAdjacentHTML('beforeEnd', `<button class="dots__dot" data-slide=${i}></button>`)
  })
  dotContainer.firstElementChild.classList.add('dots__dot--active');
}
createDots();

//SELECTING ALL THE CREATED SLIDER DOTS
const allDots = dotContainer.querySelectorAll('.dots__dot');

//CHANGING THE DOTS
const changeDot = function() {
  dotContainer.querySelectorAll('.dots__dot').forEach((child) => {
    child.classList.remove('dots__dot--active');
  })
  allDots.forEach((dot) => {
    if(dot.dataset.slide == curSlide) dot.classList.add('dots__dot--active');
    else return;
  })
}
//SLIDING THE SLIDER
const setSlide = function(curSlide = 0) {
  allSlider.forEach( (slide, i) => {
    slide.style.transform = `translateX(${100*(i - curSlide)}%)`
  }) 
  changeDot();
}
setSlide();

const nextSlide = function() {
  if(curSlide < maxSlide - 1) curSlide++;
  else curSlide = 0;
  setSlide(curSlide)
}
const previousSlide = function() {
  if(curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;
  setSlide(curSlide);
}

slideLeft.addEventListener('click', previousSlide)
slideRight.addEventListener('click', nextSlide)

document.addEventListener('keydown', function(e) {
  if(e.key === 'ArrowRight') nextSlide();
  if(e.key === 'ArrowLeft') previousSlide();
})




dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    curSlide = e.target.dataset.slide;
    setSlide(curSlide);
    changeDot();
  } else return;
})