"use strict";
window.addEventListener("DOMContentLoaded", () => {


    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add("tabheader__item_active");

    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {

                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadline = '2021-01-25';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / 1000 * 60 * 60) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {

        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);

    //modal window

    const modalOpenBtn = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalTimerId = setTimeout(openModal, 50000);


    function
    openModal() {
        modal.classList.add("show");
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }


    modalOpenBtn.forEach((item) => {
        item.addEventListener('click', openModal);

    });


    function closeModal() {

        modal.classList.add('hide');
        modal.classList.remove("show");
        document.body.style.overflow = '';
    }


    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });


    function showModalScroll() {

        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalScroll);
        }

    }

    window.addEventListener('scroll', showModalScroll);


    class MenuCard {

        constructor(title, descr, img, price, altimg, parentSelector, ...classes) {

            this.title = title;
            this.descr = descr;
            this.img = img;
            this.price = price;
            this.altimg = altimg;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 80;
            this.changeToRuble();
        }

        changeToRuble() {
            this.totalCost = this.totalCost * this.transfer;
        }

        render() {

            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element)
            } else {
                this.classes.forEach(className => element.classList.add(className));

            }
            element.innerHTML = `
                           <img src= ${this.img} alt=${this.altimg}>
                            <h3 class="menu__item-subtitle">${this.title}</h3>
                            <div class="menu__item-descr">${this.descr}</div>
                            <div class="menu__item-divider"></div>  
                            <div class="menu__item-price">
                            <div class="menu__item-cost">Цена:</div>
                            <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                           
                    `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw  new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //
    //         data.forEach(({img,altimg,title,descr,price}) => {
    //
    //             new MenuCard(title,descr,img,price,altimg, '.menu .container').render();
    //         });
    //
    //     });
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(title, descr, img, price, altimg, '.menu .container').render();
            });
        });


    /** FORMS **/

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/spinner.svg',
        success: "thanks we will be connect with you so soon",
        failure: "something wrong"

    }

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const stasusMessage = document.createElement('img');
            stasusMessage.src = message.loading;
            stasusMessage.style.cssText = ` 
                    display:block;
                    margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', stasusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData(' http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    form.reset();
                    stasusMessage.remove();
                }).catch(() => {
                showModalScroll(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
                <div class = "modal__content">
                        <div class="modal__close" data-close >×</div>
                        <div class="modal__title">${message}</div>
                </div>
        
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }


    /** SLIDER   **/


    let sliderIndex = 1;
    let offset = 0;




    const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        total = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${sliderIndex}`;

    } else {
        total.textContent = slides.length;
        current.textContent = `0${sliderIndex}`;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
       slide.style.width = width;
    });

    next.addEventListener('click',() => {
        if(offset  === (+width.slice(0, width.length - 2 ) * (slides.length - 1))){
            offset = 0;
        }else{
            offset += +width.slice(0, width.length - 2 );
        }

       slidesField.style.transform = `translateX(-${offset}px)`;
        if (sliderIndex == slides.length){
            sliderIndex = 1;
        }else{
            sliderIndex++;
        }

        if(slides.length < 10 ){
            current.textContent = `0${sliderIndex}`;
        }else{
            current.textContent = sliderIndex;
        }
    });

    prev.addEventListener('click',() => {
        if(offset  == 0 ){
            offset = +width.slice(0, width.length - 2 ) * (slides.length - 1);
        }else{
            offset -= +width.slice(0, width.length - 2 );
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (sliderIndex == 1){
            sliderIndex = slides.length;
        }else{
            sliderIndex--;
        }


        if(slides.length < 10 ){
            current.textContent = `0${sliderIndex}`;
        }else{
            current.textContent = sliderIndex;
        }
    });
    // showSliders(sliderIndex);
    //
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    //
    // } else {
    //     total.textContent = slides.length;
    // }
    //
    // function showSliders(n) {
    //
    //     if (n > slides.length) {
    //         sliderIndex = 1;
    //     }
    //
    //     if (n < 1) {
    //         sliderIndex = slides.length;
    //     }
    //
    //     slides.forEach(item => item.style.display = 'none');
    //     slides[sliderIndex - 1].style.display = 'block';
    //
    //     if (slides.length < 10) {
    //         current.textContent = `0${sliderIndex}`;
    //
    //     } else {
    //         current.textContent = sliderIndex;
    //     }
    //
    // }
    //
    // function plusSlide(n) {
    //     showSliders(sliderIndex += n);
    // }
    //
    // prev.addEventListener('click', () => {
    //     plusSlide(-1);
    // });
    //
    // next.addEventListener('click', () => {
    //     plusSlide(1);
    // });



});
