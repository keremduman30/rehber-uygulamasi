const form = document.getElementById("form-rehber");
const ad = document.getElementById("ad");
const soyad = document.getElementById("soyad");
const mail = document.getElementById("mail");
const kisiListesi = document.getElementById("kisiListesi");
const tumKisiler = [];
let secilenSatir = undefined;
// console.log(ad, soyad, mail);
form.addEventListener("submit", kaydet);
kisiListesi.addEventListener("click", kisiIslemleriYap);
function kaydet(e) {
    e.preventDefault();
    const eklenecekVeyaGunceleneceKisi = {
        ad: ad.value,
        soyad: soyad.value,
        mail: mail.value,
    };
    const sonuc = verileriKontrolEt(eklenecekVeyaGunceleneceKisi);
    if (sonuc.durum) {
        if (secilenSatir) {
            kisiyiGuncelle(eklenecekVeyaGunceleneceKisi);
        }
        else {
            kisiyiEkle(eklenecekVeyaGunceleneceKisi);
        }


    }

    else {
        bilgiOlsutur(sonuc.mesaj, sonuc.durum);
        console.log(sonuc.mesaj);
    }

}
function verileriKontrolEt(kisi) {
    for (const deger in kisi) {
        if (kisi[deger]) {

        }
        else {
            return {
                durum: false,
                mesaj: "hata"
            };
        }
    }
    alanlariTemizle();
    return {
        durum: true,
        mesaj: "Kaydedildi",
    };

}
function kisiyiGuncelle(kisi) {
    //burda kisinin yeni degerleri vardır secilen satırda da eski degerler var 
    //biz oncele tmkisiler listeside yeni kisiyi aktarmak lzım
    for (let index = 0; index < tumKisiler.length; index++) {
        if (secilenSatir.cells[2].textContent === tumKisiler[index].mail) {//eger eski deger ile tumkisiler içindeki aynı ise
            tumKisiler[index] = kisi;//yenisini aktardık
            break;
        }
    }
    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.mail;
    const submitButton = document.querySelector(".kaydetGuncelle");
    submitButton.textContent = "kaydet";
    //sonra secilenSatiri undifed yapalımki kaydet işlemleride yapılabilsin
    secilenSatir = undefined;

}
function kisiIslemleriYap(e) {
    //e.target  baglı olcan classın tumunu alır ve tıklanan her bolumu veriri
    if (e.target.classList.contains("btn--edit")) {//bizde e.targetin classi btn edit olanı aldık ve bu artık sadece tıklandıgında butonu vercek 
        const submitButton = document.querySelector(".kaydetGuncelle");
        submitButton.value = "guncelle";
        const duzenlenecekSatir = e.target.parentElement.parentElement;
        //duzenlecek saırın mailini bu sefer tablo uzerinden secelim yani cels ile
        const guncelelenecekMail = duzenlenecekSatir.cells[2].textContent;
        ad.value = duzenlenecekSatir.cells[0].textContent;
        soyad.value = duzenlenecekSatir.cells[1].textContent;
        mail.value = duzenlenecekSatir.cells[2].textContent;
        secilenSatir = duzenlenecekSatir;


    }
    else if (e.target.classList.contains("btn--delete")) {
        const silinecekTR = e.target.parentElement.parentElement;
        const silincecekMail = e.target.parentElement.previousElementSibling.textContent;//biz burda td ye ulastık ve bir onceki mail oluyor
        rehberdenSil(silinecekTR, silincecekMail);//burda target buton oluyor.birinci parent td ikinci parent tr oluyor

    }
}
function rehberdenSil(silinecekTR, silincecekMail) {
    silinecekTR.remove();//oncesatırı siliyoruz
    console.log(silinecekTR, silincecekMail);
    // maile gore silme islemi
    tumKisiler.forEach((kisi, index) => {//sonra tum kisiler dizisinde bu indexi siliyoruz
        if (kisi.mail === silincecekMail) {
            tumKisiler.splice(index, 1);
        }
    });
    console.log(tumKisiler);
    alanlariTemizle();
    document.querySelector(".kaydetGuncelle").value = "Kaydet";


}
function kisiyiEkle(eklenecekKisi) {

    const eklencekSatir = document.createElement("tr");
    eklencekSatir.innerHTML = ` <td>${eklenecekKisi.ad}</td>
    <td>${eklenecekKisi.soyad}</td>
    <td>${eklenecekKisi.mail}</td>
    <td>
        <button class="btn btn--edit">
            <i class="far fa-edit"></i>
        </button>
        <button class="btn btn--delete">
            <i class="far fa-trash-alt"></i>

        </button>


    </td>`;
    kisiListesi.appendChild(eklencekSatir);
    tumKisiler.push(eklenecekKisi);
    console.log(eklenecekKisi);
    bilgiOlsutur("kisi basarıyla kaydedildi", true);


}

function bilgiOlsutur(mesaj, durum) {
    const olusturulanBilgi = document.createElement("div");//div olsuturduk
    olusturulanBilgi.textContent = mesaj;//degeri atadık
    olusturulanBilgi.className = "bilgi";
    //document.querySelector(".container").appendChild(olusturulanBilgi);//append child sona ekler biz basa eklemek istiyoruz
    // oyuzden insert.before yapısnnu kullancaz
    document.querySelector(".container").insertBefore(olusturulanBilgi, form);//bu hangi yeni nesne ve hangisinden once gelsin diyo
    //biz formdan once dedik ve form yukaıda baglı zaten 
    //simdi biz hata ya gore bilgi classlarını gosterecez
    olusturulanBilgi.classList.add(durum ? "bilgi-success" : "bilgi-error");

    //jsde setTimeout ve setInterval var sanye işlemleridir
    //sertTimeout 2 saniye sonra calısır biz iki saniye sonra bu kutuucgu sildirecez
    setTimeout(() => {
        const silinecekDiv = document.querySelector(".bilgi");
        if (silinecekDiv) {//yani div varmo yok mu zaten ya hata yada basarıll diye bir div cıkıyor
            silinecekDiv.remove();
        }
    }, 2000);
}
function alanlariTemizle() {
    ad.value = "";
    soyad.value = "";
    mail.value = "";
}