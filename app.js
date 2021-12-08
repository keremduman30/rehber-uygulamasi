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

    for (let index = 0; index < tumKisiler.length; index++) {
        if (secilenSatir.cells[2].textContent === tumKisiler[index].mail) {
            tumKisiler[index] = kisi;
            break;
        }
    }
    secilenSatir.cells[0].textContent = kisi.ad;
    secilenSatir.cells[1].textContent = kisi.soyad;
    secilenSatir.cells[2].textContent = kisi.mail;
    const submitButton = document.querySelector(".kaydetGuncelle");
    submitButton.textContent = "kaydet";
    secilenSatir = undefined;

}
function kisiIslemleriYap(e) {

    if (e.target.classList.contains("btn--edit")) {
        const submitButton = document.querySelector(".kaydetGuncelle");
        submitButton.value = "guncelle";
        const duzenlenecekSatir = e.target.parentElement.parentElement;

        const guncelelenecekMail = duzenlenecekSatir.cells[2].textContent;
        ad.value = duzenlenecekSatir.cells[0].textContent;
        soyad.value = duzenlenecekSatir.cells[1].textContent;
        mail.value = duzenlenecekSatir.cells[2].textContent;
        secilenSatir = duzenlenecekSatir;


    }
    else if (e.target.classList.contains("btn--delete")) {
        const silinecekTR = e.target.parentElement.parentElement;
        const silincecekMail = e.target.parentElement.previousElementSibling.textContent;
        rehberdenSil(silinecekTR, silincecekMail);

    }
}
function rehberdenSil(silinecekTR, silincecekMail) {
    silinecekTR.remove();
    console.log(silinecekTR, silincecekMail);

    tumKisiler.forEach((kisi, index) => {
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
    const olusturulanBilgi = document.createElement("div");
    olusturulanBilgi.textContent = mesaj;
    olusturulanBilgi.className = "bilgi";


    document.querySelector(".container").insertBefore(olusturulanBilgi, form);

    olusturulanBilgi.classList.add(durum ? "bilgi-success" : "bilgi-error");

    setTimeout(() => {
        const silinecekDiv = document.querySelector(".bilgi");
        if (silinecekDiv) {
            silinecekDiv.remove();
        }
    }, 2000);
}
function alanlariTemizle() {
    ad.value = "";
    soyad.value = "";
    mail.value = "";
}