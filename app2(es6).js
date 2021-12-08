class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;

    }
}
class EkranIslemleri {
    constructor() {//constuctorda biz yapılacak işlem kutucukları baglıyorz
        this.ad = document.getElementById("ad");
        this.soyad = document.getElementById("soyad");
        this.mail = document.getElementById("mail");
        this.ekleGuncelleButon = document.querySelector(".kaydetGuncelle");
        this.form = document.querySelector("#form-rehber");
        this.form.addEventListener("submit", this.kaydetGuncelle.bind(this));//buton ve guncelle supmit butonları ,.,m
        this.kisiListesi = document.querySelector("#kisiListesi");
        this.kisiListesi.addEventListener("click", this.guncelleVeyaSil.bind(this));
        this.LocaleManager = new LocaleManager();
        this.kisileriEkranaYzdir();
        this.secilenTr = undefined;
    }
    guncelleVeyaSil(e) {
        const tiklananYer = e.target;
        if (tiklananYer.classList.contains("btn--delete")) {
            //  simdi duzenle butonu sectiginde biz o saturu secip silecez o satr secmek için butonun parenti td ve td parenti tr olutr
            this.secilenTr = tiklananYer.parentElement.parentElement;
            this.kisiyiEkrandanSil();

        }
        else if (tiklananYer.classList.contains("btn--edit")) {
            //  simdi duzenle butonu sectiginde biz o saturu secip duzenliecez o satr secmek için butonun parenti td ve td parenti tr olutr
            this.secilenTr = tiklananYer.parentElement.parentElement;
            this.ekleGuncelleButon.value = "Guncelle";
            this.ad.value = this.secilenTr.cells[0].textContent;
            this.soyad.value = this.secilenTr.cells[1].textContent;
            this.mail.value = this.secilenTr.cells[2].textContent;

            //this.kisiyiEkrandaGuncelle();


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
        // this.ad.value=secilenSatir.cells[0].textContent;
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
        // console.log("evet calıstı");
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrol(kisi.ad, kisi.soyad, kisi.mail);
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
        //console.log("email. kontrol: " + emailGecerliMi);

        if (!emailGecerliMi) {
            this.bilgiOlustur("lütfen gecerli bir mail giriiiz", false);
            return;
        }

        if (sonuc) {//hata yok
            //eger secilentr unndifined deilse guncelleeme yapılacak ama undified ise yapılmıyoack
            if (this.secilenTr) {
                this.kisiyiEkrandaGuncelle(kisi);
            }
            else {
                //eger secilensatır bos ise demekki ekleme yapılacaktır
                //console.log("basarılı");
                //kisiyi ekrana ekleme
                this.kisiyiEkranaEkle(kisi);
                //simdi locale ekleme
                this.LocaleManager.kisiEkle(kisi);

            }


        }
        else {//hata var
            this.bilgiOlustur("lütfen bos alnlari doldurunuz");

        }
        //console.log(kisi);
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
        this.bilgiOlustur("kisi basarıyla eklendi", true);
    }
    alanlaritemizle() {
        this.ad.value = "";
        this.soyad.value = "";
        this.mail.value = "";
    }
    bilgiOlustur(mesaj, durum) {
        const olusturulanBilgi = document.createElement("div");//div olsuturduk
        olusturulanBilgi.textContent = mesaj;//degeri atadık
        olusturulanBilgi.className = "bilgi";
        //document.querySelector(".container").appendChild(olusturulanBilgi);//append child sona ekler biz basa eklemek istiyoruz
        // oyuzden insert.before yapısnnu kullancaz
        document.querySelector(".container").insertBefore(olusturulanBilgi, this.form);//bu hangi yeni nesne ve hangisinden once gelsin diyo
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

}
class Util {//hata kontrolleri için
    static bosAlanKontrol(...alanlar) {//akac tabe parametre alacagı belli dgilse ... nokta yeterlidir
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
    //uygulama ilk acldgında verileri getirsin

    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }
    kisileriGetir() {
        let tumKisilerLocal;
        if (localStorage.getItem("tumKisiler") == null) {
            tumKisilerLocal = [];
        }
        else {
            //eger boyle bir local kaydı varsa json a donusturmek lazım
            tumKisilerLocal = JSON.parse(localStorage.getItem("tumKisiler"));

        }

        return tumKisilerLocal;;
    }
    kisiEkle(kisi) {
        //sadece verileri locale kaydedecez oyuzden buraya yazdık

        this.tumKisiler.push(kisi);
        //ekledikten sonra bunu locale soyletmemiz lazım yani bilgi cunku degisiklik var
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
// simdi biz butun sınıgları yazdık ama cagırmadık ve sayfa yuklenir yuklenmez calısması için 
document.addEventListener("DOMContentLoaded", (e) => {//DOMContentLoaded yuklenir yuklenmez demek
    const ekran = new EkranIslemleri();
    console.log("acıldı");
});
