var svi;
$(document).scroll(function() {
    if ($(document).scrollTop() > 50) {
        $("#header").addClass("fiksniMeni");
        $(".strelica").removeClass("sakrij");
        $(".strelica").addClass("prikazi");


    } else {

        $("#header").removeClass("fiksniMeni");
        $(".strelica").removeClass("prikazi");
        $(".strelica").addClass("sakrij");
    }

});
window.onload = function() {
    // alert(window.location.href);
    localStorage.removeItem("products");
    localStorage.removeItem("searchObjs");

    let url = window.location.href.split("/");
    let adresa = url[url.length - 1];



    $.ajax({
        url: "data/meni.json",
        method: "get",
        dataType: "json",
        success: function(data) {
            //    console.log(data);
            prikaziMeni(data);

        },
        error(xhr, status, err) {
            console.log(xhr);
            console.log(status);
            console.log(err);

        }
    })
    $.ajax({
        url: "data/futer.json",
        method: "get",
        dataType: "json",
        success: function(data) {
            //    console.log(data);
            prikaziFuter(data)

        },
        error(xhr, status, err) {
            console.log(xhr);
            console.log(status);
            console.log(err);

        }
    })




    if (adresa == "index.html") {

        document.getElementById("cfBtn").addEventListener("click", proveriPodatke);



    } else if (adresa == "store.html") {
        $.ajax({
            url: "data/products.json",
            method: "get",
            dataType: "json",
            success: function(data) {
                // console.log(data);
                svi = data;
                prikaziProizvode(data);

            },
            error(er) {
                console.log(er);
            }
        })
        $.ajax({
            url: "data/deviceTypes.json",
            method: "get",
            dataType: "json",
            success: function(data) {
                popuniDeviceTypes(data);
                bookDTP = data;


            },
            error: function(err) {
                console.log(err)
            }
        })
        document.getElementById("devTypeDDL").addEventListener("change", popuniModele);
        document.getElementById("modelsDDL").addEventListener("change", filterPoModelu);
        popuniFiltere();
        document.getElementById("devicesDDL").addEventListener("change", sortiranje);
        document.getElementById("searchBtn").addEventListener("click", pretrazi);
    } else if (adresa == "cart.html") {

        $.ajax({
            url: "data/products.json",
            method: "get",
            dataType: "json",
            success: function(data) {
                svi = data;
                iscitajIzKorpe(data);
            },
            error(er) {
                console.log(er);
            }
        })


    }

}

function prikaziMeni(stavke) {
    let divIspis = document.getElementById("meni");
    html = "";
    stavke.forEach(stavka => {
        if (stavka.tekst == "<i class=\"fas fa-bars\"></i>") {
            html += `<li class="d-flex justify-content-end hamburger" id="meniToggle"><a href="${stavka.href}" class="nav-link">${stavka.tekst}</a></li>`;
        } else {
            html += `<li class="d-flex justify-content-end stavka sakrij"><a href="${stavka.href}" class="nav-link d-flex justify-content-end align-items-center">${stavka.tekst}</a></li>`
        }
    })
    // console.log(html);
    divIspis.innerHTML = html;
    $(".hamburger").click(function(e) {

        e.preventDefault();

        if ($("#meni .stavka").is(":visible")) {
            $("#meni .stavka").removeClass("prikazi");
            $("#meni .stavka").addClass("sakrij");
        } else {
            $("#meni .stavka").remove("sakrij");
            $("#meni .stavka").addClass("prikazi");

        }

    })

}

function prikaziFuter(stavke) {
    let divIspis = document.getElementById("futerMeni");
    let html = "";
    stavke.forEach(stavka => {
        html += `<li ><a href="${stavka.href}" target="_blank">${stavka.tekst}</a></li>`;
    })
    divIspis.innerHTML = html;
}

function prikaziProizvode(devices) {
    let divIspis = document.getElementById("products");
    html = "";
    devices.forEach(device => {
        html += `<div class="col-lg-3 " >
           <div class="productsmd" data-id="${device.id}"> <div class="name">
                <h5 class="text-center">${device.name}</h5>
            </div>
        <div class="deviceImg d-flex justify-content-center">
            <img src="${device.picture.src}" alt="${device.picture.alt}" class="img-fluid">
        </div>
        <div class="colors d-flex justify-content-center">
           ${vratiBoje(device.colors)}

        </div>
        <div class="line"></div>
        <div><p class="text-center"><b>Starting at &dollar;${device.startingPrice}</b></p></div>
        </div>
        <div class="buy d-flex justify-content-center">
            <a href="#" class ="dodajUkorpu"data-prodid="${device.id}" class="text-center">Buy</a>
        </div>
    </div>`;


    });
    divIspis.innerHTML = html;
    $(".dodajUkorpu").click(dodajUkorpu);
    $(".productsmd").click(prikaziUredjajeModal)
}

function vratiBoje(boje) {
    let html = "";
    boje.forEach(boja => {
        html += `<div  class="color" style="background-color:${boja};"></div>`;
    })
    return html;
}

function popuniDeviceTypes(types) {
    let divIspis = document.getElementById("devTypeDDL");
    html = "";
    types.forEach(type => {
        html += `<option value="${type.id}">${type.name}</option>`;

    });
    divIspis.innerHTML += html;

}

function popuniModele() {

    let chosenDevice = document.getElementById("devTypeDDL").value;
    //localStorage.removeItem("searchObjs");

    var p;
    let productIDs = [];
    let modeli;
    if (chosenDevice == 0) {
        document.getElementById("modelsDDL").innerHTML = `<option value="0">Models</option>`;
        prikaziProizvode(svi);


        br = 0;
        modeli = svi;
        modeli.forEach(model => {
            productIDs[br++] = {
                deviceID: model.id,
                seriesID: model.series.id,
                deviceTypeID: deviceType.id
            };
        })
        localStorage.setItem("products", JSON.stringify(productIDs));

    } else {
        $.ajax({
            url: "data/products.json",
            method: "get",
            dataType: "json",
            success: function(data) {
                let modeli;
                if (chosenDevice == 1)
                    modeli = data.filter(d => d.deviceType.id == chosenDevice && d.series.id != undefined);

                else
                    modeli = data.filter(d => d.deviceType.id == chosenDevice);


                br = 0;
                modeli.forEach(model => {
                    productIDs[br++] = {
                        deviceID: model.id,
                        seriesID: model.series.id,
                        deviceTypeID: model.deviceType.id
                    };
                })

                localStorage.setItem("products", JSON.stringify(productIDs));
                ispisiIphoneSerije(modeli)
                prikaziProizvode(modeli);


            },
            error(er) {
                console.log(er);
            }
        })
    }
}

function ispisiModele(modeli) {
    let modelsDDL = document.getElementById("modelsDDL");
    let html = "";
    modeli.forEach(model => {
        html += `<option value="${model.id}">${model.name}</option>`;
    });
    modelsDDL.innerHTML = `<option value="0">Models</option>`;
    modelsDDL.innerHTML += html;
}

function popuniFiltere() {
    let nizFiltera = ["Price ascending", "Price descending", "Name ascending", "Name descending"];

    let html = "";
    let divIspis = document.getElementById("devicesDDL");
    let br = 1;
    nizFiltera.forEach(filter => {
        let val = filter.split(" ")[0] + "-" + filter.split(" ")[1].toLowerCase().substr(0, 1);
        html += `<option value="${val}">${filter}</option>`;
    })
    divIspis.innerHTML += html;

}

function ispisiIphoneSerije(iphoni) {
    let divIspis = document.getElementById("modelsDDL");
    let html = "";
    let nizSerija = [];
    iphoni.forEach(iphone => {
        if (!nizSerija.includes(iphone.series.name)) {
            nizSerija.push(iphone.series.name)
            html += `<option value="${iphone.series.id}">${iphone.series.name}</option>`;
        }

    });
    divIspis.innerHTML = `<option value="0">Models</option>`;

    divIspis.innerHTML += html;
}

function filterPoModelu() {
    let chosenModel = document.getElementById("modelsDDL").value;
    let chosenDevice = document.getElementById("devTypeDDL").value;
    localStorage.removeItem("searchObjs");


    let zaIspis;
    (chosenModel != 0) ? zaIspis = svi.filter(p => p.series.id == chosenModel): zaIspis = svi.filter(p => p.deviceType.id == chosenDevice);
    prikaziProizvode(zaIspis);


}

function sortiranje() {
    let deviceType = document.getElementById("devTypeDDL").value;
    let models = document.getElementById("modelsDDL").value;
    let filter = document.getElementById("devicesDDL").value;
    let poCemuSeSortira = filter.split("-")[0];
    let poredak = filter.split("-")[1];

    let sortirano = sortiraj(deviceType, models, poCemuSeSortira, poredak);
    prikaziProizvode(sortirano);
}

function sortiraj(devType, models, criteria, order) {
    let p = productsForSorting(devType, models);
    if (JSON.parse(localStorage.getItem("searchObjs")) != null && JSON.parse(localStorage.getItem("searchObjs")).length > 0) {
        return sorting(JSON.parse(localStorage.getItem("searchObjs")), criteria, order)
    }
    return (devType == 0) ? sorting(svi, criteria, order) : sorting(p, criteria, order)

}


function productsForSorting(deviceType, models) {

    let productsLS = JSON.parse(localStorage.getItem("products"));
    if (JSON.parse(localStorage.getItem("searchObjs")) != null && JSON.parse(localStorage.getItem("searchObjs")).length > 0) {
        return JSON.parse(localStorage.getItem("searchObjs"))
    }
    return (models == 0) ? svi.filter(el => el.deviceType.id == deviceType) : svi.filter(el => el.deviceType.id == deviceType && el.series.id == models);


}

function sorting(products, criteria, order) {

    let sorted = (order == 'a') ? products.sort(function(a, b) {
        let kritA = criteria == "Price" ? a.startingPrice : a.name;
        let kritB = criteria == "Price" ? b.startingPrice : b.name;

        if (kritA > kritB) return 1;
        if (kritA < kritB) return -1;
        else return 0;
    }) : products.sort(function(a, b) {
        let kritA = criteria == 'Price' ? a.startingPrice : a.name;
        let kritB = criteria == 'Price' ? b.startingPrice : b.name;
        if (kritA > kritB) return -1;
        if (kritA < kritB) return 1;
        else return 0;
    })
    return sorted;

}

function pretrazi(e) {
    e.preventDefault();
    let zaPrikaz;
    let query = document.getElementById("tbSearch").value;
    if (!localStorage.getItem("products")) {
        zaPrikaz = svi.filter(p => p.name.toLowerCase().indexOf(query.toLowerCase()) != -1);
    } else {
        let productsLS = JSON.parse(localStorage.getItem("products"));
        //    console.log(productsLS);

        let zaPretragu = svi.filter(p => productsLS.some(x => x.deviceTypeID == p.deviceType.id));
        //  console.log(filter);
        zaPrikaz = zaPretragu.filter(p => p.name.toLowerCase().indexOf(query.toLowerCase()) != -1);
    }

    localStorage.setItem("searchObjs", JSON.stringify(zaPrikaz));
    //console.log(zaPrikaz);

    prikaziProizvode(zaPrikaz);
    if (zaPrikaz.length == 0) {
        document.getElementById("products").innerHTML += `<h3>Requested product doesn't exist!</h3>`;
    }
}

function dodajUkorpu(e) {
    e.preventDefault();
    let id = Number(this.dataset.prodid);
    let productInCarts = [];

    if (!localStorage.getItem("zaKorpu")) {
        let obj = {
            id: id,
            quantity: 1
        };
        productInCarts.push(obj);
        localStorage.setItem("zaKorpu", JSON.stringify(productInCarts));
    } else {
        let uKorpi = JSON.parse(localStorage.getItem("zaKorpu"))
        let postoji = uKorpi.filter(x => x.id == id);
        if (postoji.length) {
            postoji[0].quantity += 1;
            localStorage.setItem("zaKorpu", JSON.stringify(uKorpi));

        } else {
            let uKorpi = JSON.parse(localStorage.getItem("zaKorpu"));
            let obj = {
                id: id,
                quantity: 1
            }
            uKorpi.push(obj);
            localStorage.setItem("zaKorpu", JSON.stringify(uKorpi));

        }

    }
}

function proveriPodatke() {
    let fname = document.getElementById("tbName").value;
    let lname = document.getElementById("tbLName").value;
    let email = document.getElementById("tbEmail").value;
    let message = document.getElementById("taMessage").value;

    let regFname = /^[A-Z][a-z]{2,19}$/;
    let nameFlag = ispravno(fname, regFname, document.getElementById("fnameError"), "First name must start with a capital and must be to 20 characters long.");

    let regLname = /^[A-Z][a-z]{2,19}(\s[A-Z][a-z]{2,19})*$/;
    let lNameFlag = ispravno(lname, regLname, document.getElementById("lnameError"), "Last name must start with a capital and must be to 20 characters long.");
    let regEmail = /^[a-z-0-9]+@[a-z]{3,8}\.[a-z]{2,4}$/;
    let emailFlag = ispravno(email, regEmail, document.getElementById("emailError"), "Email must be in correct format:john.doe@example.com");
    let regMessage = /^[A-Z][\w\s\.\/]{4,200}$/;
    let messageFlag = ispravno(message, regMessage, document.getElementById("messageError"), "Message must start with a capital, and must be between 5 and 200 characters.");
    if (nameFlag && lNameFlag && emailFlag && messageFlag) {
        window.open('mailto:apple@info.com');
    }

}

function ispravno(podatak, regularniIzraz, greskaPolje, greskaTekst) {
    if (!regularniIzraz.test(podatak)) {
        greskaPolje.innerHTML = greskaTekst;
        return false;
    } else {
        greskaPolje.innerHTML = "";
        return true;

    }
}

function prikaziUredjajeModal() {
    let id = this.dataset.id;
    let uredjaj = svi.filter(p => p.id == id);
    let proizvod = uredjaj[0];
    ispisiProizvodModal(uredjaj)

}

function ispisiProizvodModal(proizvod) {
    let divIspis = document.getElementById("modal-Device");
    let html = ``;
    proizvod.forEach(el => {
        html = ` 
        <div class=" " id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-xl modal-dialog-scrollable gmm" role="document">
        <div class="modal-content">
                <div class="modal-header">
                    <h4 class="text-center">${el.name}</h4>
                    <button type="button" class="close"> <span class="hideModal">&times;</span></button>
                </div>
            
                <div class="modal-body">
                    <div class="prodImg d-flex justify-content-center">
                        <img src="${el.picture.src}" alt="${el.picture.alt}" class="img-fluid"/>
                    </div>
                    <div class="tableDiv mt-2">
                    <table class="table">
                    <tr>
                        <td >Price:</td>
                        <td>&dollar;${el.startingPrice}</td>
                    </tr>
                     <tr>
                        <td>Display:</td>
                        <td>Size:<b>${el.display.size}</b><br>Type:${el.display.type.name}</td>
                    </tr>
                    <tr>
                    <td>Camera:</td>
                    <td>Sensor:<b>${el.camera.mps}mp</b><br>Recording:${el.camera.recording}</td>
                </tr>
                <tr>
                        <td>Unlock mechanism:</td>
                        <td>${el.unlockMechanism}</td>
                    </tr>
                    <tr>
                    <td>Processor:</td>
                    <td>${el.CPU}</td>
                </tr>
                <td>Battery:</td>
                    <td>${el.battery}</td>
                </tr>
                <td>Capacity:</td>
                    <td>${dajKapacitete(el.capacity,el.deviceType.name)}</td>
                </tr>
                    </table>
                    </div>
            
            
                </div>
            <div class="modal-footer">
                <div class="buy d-flex justify-content-center">
                <a href="#" class ="dodajUkorpu"data-prodid="${el.id}" class="text-center">Buy</a>
                </div>
            </div>
        </div></div></div>
    `
    })
    divIspis.innerHTML = html;
    divIspis.classList.add("show-bg");
    divIspis.classList.remove("hide-bg");


    $(".hideModal").click(sakrijModal);

    $(".dodajUkorpu").click(dodajUkorpu);

}

function dajKapacitete(kapaciteti, name) {
    ispis = "";
    let br = 0;
    kapaciteti.forEach(k => {
        if (name != "MackBook") {
            (br == 0) ? ispis += `${k}GB`: ispis += `, ${k}GB`;
            br++;
        } else {
            (br == 0) ? ispis += `${k}TB`: ispis += `, ${k}TB`;
            br++;
        }
    })
    return ispis;
}

function sakrijModal() {
    $("#modal-Device").removeClass("show-bg")

    $("#modal-Device").addClass("hide-bg")
}

//---------------------KORPA-------------------------
function iscitajIzKorpe(podaci) {
    praznaKorpa();
    let cartDiv = document.getElementById("cart");
    if (!localStorage.getItem("zaKorpu")) {
        cartDiv.innerHTML = `<h2 class="text-center donjiIgornjiPadding">Your cart is empty!</h2><a  href="store.html"class="text-center pb-4"><h4 class=" pb-4 text-primary">Go back to store</h4></a>`;
    } else {
        let products = JSON.parse(localStorage.getItem("zaKorpu"));
        let uredjajiUkorpi = [];
        products.forEach(el => {
            uredjajiUkorpi.push(el.id);
        });
        let zaPrikaz = podaci.filter(element => uredjajiUkorpi.includes(element.id))

        prikaziItemeIzKorpe(zaPrikaz);
    }
}

function prikaziItemeIzKorpe(items) {
    praznaKorpa();
    let divIspis = document.getElementById("cart");
    html = `<table class="table"><tr><td>#</td><td>Picture</td><td>Articles</td><td>Price</td><td class="text-center">Quantity</td></tr>`;
    let br = 1;
    items.forEach(el => {
        html += `<tr class=""><td >${br++}</td><td><img src="${el.picture.src}" alt="${el.picture.alt}" class="img-fluid"></td><td>${el.name}</td><td>&dollar;${el.startingPrice}</td><td align="center"><button class="dodaj d-block dugme bg-dark text-light " data-pid="${el.id}">+</button><span id="q${el.id}"class=" ">${dajKolicinu(el.id)}</span><button class="oduzmi dugme  bg-dark text-light  d-block pl-2 pr-2" data-pid="${el.id}">-</button><button data-pid="${el.id}" class="obrisi  bg-dark mt-2 text-light dugme d-block"><i class="fas fa-trash-alt"></i></button></td></tr>`
    })


    html += `<tr><td colspan="5" class="text-center"><b>Total:&dollar;${dajSumu(items)}</b></td></tr>`
    html += "</table>";
    divIspis.innerHTML = html;
    $(".oduzmi").click(umanjiKolicinu);
    $(".dodaj").click(dodajKolicinu);
    $(".obrisi").click(obrisiProizvod);

}

function dajKolicinu(idUredaja) {
    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    let kolicina = products.filter(p => p.id == idUredaja)
    return kolicina[0].quantity;

}

function dajSumu(items) {
    let suma = 0;
    items.forEach(el => {
        suma += el.startingPrice * dajKolicinu(el.id);
    })
    return suma;
}

function umanjiKolicinu(e) {
    e.preventDefault();
    let id = this.dataset.pid;
    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    let obj = products.filter(p => p.id == id);
    obj[0].quantity -= 1;
    localStorage.setItem("zaKorpu", JSON.stringify(products));
    osveziKolicine(id);
    proveriKolicine(id);
    iscitajIzKorpe(svi);
    praznaKorpa();

}

function dodajKolicinu(e) {
    e.preventDefault();
    let id = this.dataset.pid;
    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    let obj = products.filter(p => p.id == id);
    obj[0].quantity += 1;
    localStorage.setItem("zaKorpu", JSON.stringify(products));
    osveziKolicine(id);
    proveriKolicine(id);
    iscitajIzKorpe(svi);


}

function osveziKolicine(id) {
    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    let kolicina = products.filter(p => p.id == id)
    document.getElementById(`q${id}`).innerHTML = kolicina[0].quantity;
    praznaKorpa();


}

function proveriKolicine(id) {

    let prodid = id;
    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    let productQ = products.filter(p => p.id == prodid)
    let quantity = productQ[0].quantity;
    let index = 0;
    if (quantity == 0) {


        for (var i in products) {
            if (products[i].id == prodid) {
                index = i;

            }
        }

        products.splice(index, 1);
        localStorage.setItem("zaKorpu", JSON.stringify(products));
        praznaKorpa();
    }
}

function praznaKorpa() {

    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    if (products == null || products.length === 0) {
        localStorage.removeItem("zaKorpu");
    }
}

function obrisiProizvod() {
    let id = this.dataset.pid;

    let products = JSON.parse(localStorage.getItem("zaKorpu"));
    for (var i in products) {
        if (products[i].id == id) {
            index = i;

        }
    }
    products.splice(index, 1);
    localStorage.setItem("zaKorpu", JSON.stringify(products));
    praznaKorpa();
    iscitajIzKorpe(svi);

}