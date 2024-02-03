const quiz= new Quiz(sorular);
const ui = new UI();

//Soruyu getir işaretlemeden önce sonraki butonunu kaldır.
    ui.btn_start.addEventListener("click",function(){   
    startTimer(10);
    startTimerLine();
    ui.quiz_box.classList.add("active");
    ui.soruGoster(quiz.soruGetir());   
    ui.soruSayisiniGoster(quiz.soruIndex+1, quiz.sorular.length);  // her soru getirildiğinde soru sayısı güncellensin
    ui.next_btn.classList.remove("show");
})


ui.next_btn.addEventListener("click",function(){
    if(quiz.sorular.length != quiz.soruIndex+1){   // quiz indexi soru adedine eşit olmadığı sürece soruyu getir.
        quiz.soruIndex += 1;
        clearInterval(counter);// sayacı temizle
        clearInterval(counterLine);
        startTimer(10);    
        startTimerLine();
        ui.soruGoster(quiz.soruGetir());
        ui.soruSayisiniGoster(quiz.soruIndex+1, quiz.sorular.length);  // sonraki soruya tıklandığında soru sayısı güncellensin
        ui.next_btn.classList.remove("show");

    }
    else{
        clearInterval(counter); 
        clearInterval(counterLine);
        ui.quiz_box.classList.remove("active");
        ui.score_box.classList.add("active");
        ui.skoruGoster(quiz.sorular.length, quiz.dogruCevapSayisi);
    } 
});

ui.btn_quit.addEventListener("click", function(){
    window.location.reload(); // sayfayı yeniden yükler
});

ui.btn_replay.addEventListener("click", function(){
    quiz.soruIndex=0;       // soru sayisi ve dogrucevap sıfırlansın.
    quiz.dogruCevapSayisi=0;
    ui.btn_start.click(); // start butonuna tıklamış olduk.
    ui.score_box.classList.remove("active");
});

// cevap kontrolü
function optionSelected(option){
    clearInterval(counter); // seçim yaptığımız anda sayaç ve line dursun
    clearInterval(counterLine);

    let cevap = option.querySelector("span b").textContent;
    let soru = quiz.soruGetir();

    if(soru.cevabiKontrolEt(cevap)){
        quiz.dogruCevapSayisi +=1; 
        option.classList.add("correct");
        option.insertAdjacentHTML("beforeend", ui.correctIcon);
    }
    else{
        option.classList.add("incorrect");
        option.insertAdjacentHTML("beforeend",ui.incorrectIcon);
    }
    // Kullanıcının tek bir seçim yapabilmesi.
    for(let i =0; i < ui.option_list.children.length; i++){
        ui.option_list.children[i].classList.add("disabled");
    }

        ui.next_btn.classList.add("show");
}

// zamanlayıcı ve otomatik isaretleme
let counter;
function startTimer(time){
  counter = setInterval(timer, 1000); // 1000 milisaniyede bir timer fonksiyonunu calıştır
  function timer(){
    ui.time_second.textContent = time;
    time--;
    
    if(time < 0){   // şart sağlanıyorsa durdur.
        clearInterval(counter);

        ui.time_text.textContent ="Süre Bitti";

        let cevap = quiz.soruGetir().dogruCevap;
        for(let option of ui.option_list.children){
            if(option.querySelector("span b").textContent == cevap){
                option.classList.add("correct");    // doğru cevap rengi eklensin
                option.insertAdjacentHTML("beforeend", ui.correctIcon); //doğru cevap ikonu eklensin
            }

            option.classList.add("disabled"); // süre bittiği için bütün şıkların tıklanma özelliği kaybolsun
        }

        ui.next_btn.classList.add("show");
    }
  }
}

let counterLine;
function startTimerLine(){
    let line_width = 0;

    counterLine = setInterval(timer, 20);

    function timer(){
        line_width +=1;
        ui.time_line.style.width = line_width + "px";

        if(line_width > 549){
            clearInterval(counterLine);
        }
    }
}

