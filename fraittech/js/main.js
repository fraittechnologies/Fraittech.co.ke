    // Fallback: Always hide spinner after 1s in case jQuery or other scripts fail
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            var spinner = document.getElementById('spinner');
            if (spinner && spinner.classList.contains('show')) {
                spinner.classList.remove('show');
            }
        }, 1000);
    });
    // Clients carousel
    $(".clients-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 0,
        smartSpeed: 2000,
        autoplaySpeed: 2000,
        autoplayHoverPause: false,
        margin: 30,
        dots: false,
        loop: true,
        rtl: true,
        nav: false,
        slideTransition: 'linear',
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });
(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);


// Hero Slider Functionality
let currentSlideIndex = 1;
let sliderAutoplayTimeout;

function changeSlide(n) {
    clearTimeout(sliderAutoplayTimeout);
    showSlide(currentSlideIndex += n);
    autoplaySlider();
}

function currentSlide(n) {
    clearTimeout(sliderAutoplayTimeout);
    showSlide(currentSlideIndex = n);
    autoplaySlider();
}

function showSlide(n) {
    let slides = document.querySelectorAll('.hero-slide');
    let indicators = document.querySelectorAll('.indicator');
    
    if (n > slides.length) {
        currentSlideIndex = 1;
    }
    if (n < 1) {
        currentSlideIndex = slides.length;
    }
    
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    if (indicators[currentSlideIndex - 1]) {
        indicators[currentSlideIndex - 1].classList.add('active');
    }
}

function autoplaySlider() {
    sliderAutoplayTimeout = setTimeout(function() {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

// Initialize slider on page load
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlideIndex);
    autoplaySlider();
});

