class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;

    }
}
class EkranIslemleri {
    constructor() {
        this.ad = document.getElementById("ad");
        this.soyad = document.getElementById("soyad");
        this.mail = document.getElementById("mail");
        this.ekleGuncelleButon = document.querySelector(".kaydetGuncelle");
        this.form = document.querySelector("#form-rehber");
        this.form.addEventListener("submit", this.kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector("#kisiListesi");
        this.kisiListesi.addEventListener("click", this.guncelleVeyaSil.bind(this));
        this.LocaleManager = new LocaleManager();
        this.kisileriEkranaYzdir();
        this.secilenTr = undefined;
    }
    guncelleVeyaSil(e) {
        const tiklananYer = e.target;
        if (tiklananYer.classList.contains("btn--delete")) {
           
            this.secilenTr = tiklananYer.parentElement.parentElement;
            this.kisiyiEkrandanSil();

        }
        else if (tiklananYer.classList.contains("btn--edit")) {
           
            this.secilenTr = tiklananYer.parentElement.parentElement;
            this.ekleGuncelleButon.value = "Guncelle";
            this.ad.value = this.secilenTr.cells[0].textContent;
            this.soyad.value = this.secilenTr.cells[1].textContent;
            this.mail.value = this.secilenTr.cells[2].textContent;



        }

    }
    kisiyiEkrandaGuncelle(kisi) {
        this.LocaleManager.kisiGuncelle(kisi, this.secilenTr.cells[2].textContent);

        this.secilenTr.cells[0].textContent = kisi.ad;
        this.secilenTr.cells[1].textContent = kisi.soyad;
        this.secilenTr.cells[2].textContent = kisi.mail;



        this.alanlaritemizle();
        this.secilenTr = undefined;
        this.ekleGuncelleButon.value = "Kaydet";
        
    }
    kisiyiEkrandanSil() {
        this.secilenTr.remove();
        const secilenTrMail = this.secilenTr.cells[2].textContent;
        this.LocaleManager.kisiSil(secilenTrMail);
        this.secilenTr = undefined;
        this.bilgiOlustur("kisi silindi", true);
    }
    kisileriEkranaYzdir() {
        this.LocaleManager.tumKisiler.forEach(kisi => {
            this.kisiyiEkranaEkle(kisi);
        });
    }
    kaydetGuncelle(e) {
        e.preventDefault();
     
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrol(kisi.ad, kisi.soyad, kisi.mail);
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
    

        if (!emailGecerliMi) {
            this.bilgiOlustur("l??tfen gecerli bir mail giriiiz", false);
            return;
        }

        if (sonuc) {
           
            if (this.secilenTr) {
                this.kisiyiEkrandaGuncelle(kisi);
            }
            else {
             
                this.kisiyiEkranaEkle(kisi);
           
                this.LocaleManager.kisiEkle(kisi);

            }


        }
        else {
            this.bilgiOlustur("l??tfen bos alnlari doldurunuz");

        }
     
    }
    kisiyiEkranaEkle(kisi) {
        const olusturulanTr = document.createElement("tr");
        olusturulanTr.innerHTML = ` 
        <td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
        </td>`;


        this.kisiListesi.appendChild(olusturulanTr);
        this.bilgiOlustur("kisi basar??yla eklendi", true);
    }
    alanlaritemizle() {
        this.ad.value = "";
        this.soyad.value = "";
        this.mail.value = "";
    }
    bilgiOlustur(mesaj, durum) {
        const olusturulanBilgi = document.createElement("div");
        olusturulanBilgi.textContent = mesaj;
        olusturulanBilgi.className = "bilgi";
       
        document.querySelector(".container").insertBefore(olusturulanBilgi, this.form);
     
        olusturulanBilgi.classList.add(durum ? "bilgi-success" : "bilgi-error");

     
        setTimeout(() => {
            const silinecekDiv = document.querySelector(".bilgi");
            if (silinecekDiv) {
                silinecekDiv.remove();
            }
        }, 2000);
    }

}
class Util {
    static bosAlanKontrol(...alanlar) {
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length === 0) {
                sonuc = false;
                return false;
            }
        });
        return sonuc;

    }
    static emailGecerliMi(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

}
class LocaleManager {
   

    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }
    kisileriGetir() {
        let tumKisilerLocal;
        if (localStorage.getItem("tumKisiler") == null) {
            tumKisilerLocal = [];
        }
        else {
            
            tumKisilerLocal = JSON.parse(localStorage.getItem("tumKisiler"));

        }

        return tumKisilerLocal;;
    }
    kisiEkle(kisi) {
      

        this.tumKisiler.push(kisi);
       
        localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));


    }
    kisiSil(mail) {
        this.tumKisiler.forEach((kisi, index) => {
            if (kisi.mail === mail) {
                this.tumKisiler.splice(index, 1);
            }
        });
        localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));

    }
    kisiGuncelle(guncellenecekKisi, mail) {
        this.tumKisiler.forEach((kisi, index) => {
            if (kisi.mail === mail) {
                this.tumKisiler[index] = guncellenecekKisi;
            }
        });
        localStorage.setItem("tumKisiler", JSON.stringify(this.tumKisiler));

    }

}

document.addEventListener("DOMContentLoaded", (e) => {
    const ekran = new EkranIslemleri();
    console.log("ac??ld??");
});
