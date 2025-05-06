export function animateDetails() {

    gsap.from("#details-container", {
        opacity: 0,
        x: -200,
        duration: 1.5,
        ease: "power2.out",
    });

    const image = document.getElementById("profile-image");

    image.onload = () => {
        gsap.fromTo(
            image,
            {
                scale: 0.1,  
                filter: "blur(20px)", 
                opacity: 0, 
            },
            {
                scale: 1,  
                filter: "blur(0px)",
                opacity: 1, 
                duration: 2, 
                ease: "power2.out", 
            }
        );
    };

    if (image.complete) {
        image.onload();
    }
}

export function animateNavButtons() {
    
    gsap.from("nav a", {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        stagger: 0.2, 
        ease: "back.out(1.7)",
    });
}


window.onload = () => {
    setTimeout(() => animateDetails(), 500); 
    setTimeout(() => animateNavButtons(), 1000); 
};

const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');

  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.mySwiper', {
        slidesPerView: 2, 
        spaceBetween: 20, 
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        loop: true, 
        breakpoints: {
            768: { 
                slidesPerView: 2,
            },
            1024: { 
                slidesPerView: 2,
            },
            640: { 
                slidesPerView: 1,
            },
        },
    });
});