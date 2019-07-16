import {Vue, ElementUI} from './addon'
import Core from './core';
import indexVue from '../views/index.vue';

// import img1 from '../images/img_01.png';
// import img2 from '../images/img_02.png';
// const loadImg=img=>{
//     const newImg=new Image();
//     newImg.onload=()=>document.body.appendChild(newImg);
//     newImg.src=img;
// };
// loadImg(img1);
// loadImg(img2);


// import {test, show} from './show';
// show('kaivon');
// test(1233);

Vue.use(ElementUI);
Core.init(Vue)

new Vue({
    render: h => h(indexVue)
}).$mount('#page')