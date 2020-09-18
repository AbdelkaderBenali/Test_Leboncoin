const axios = require('axios');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const FormData = require('form-data');
const fs = require('fs');

const URL = "https://leboncoin-borisdjeredou-050520.herokuapp.com";
let id = "";
let token1 = "";
let token2 = "";

describe("Test 1 : Création d'une annonce", () => {

    it("T 1.1 : Création annonce sans se connecter", () => {
        const formData = new FormData();
        formData.append('title', 'Voiture electrique pour enfant');
        formData.append('description', 'Belle voiture en très bon état');
        formData.append('price', '300');
        formData.append('picture', fs.createReadStream('C:/Users/abdel/Desktop/Photo/voiture.jpg'));
        const token = '';

        return axios({
            method: 'post',
            url: `${URL}/offer/publish`,
            data: formData,
            headers: { ...formData.getHeaders(), 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        }).catch(error => {
            const codeErr = error.response.status;
            const expectedCodeErr = 401;
            const msgErr = error.response.data.message;
            const expectedMsgErr = 'Unauthorized';

            expect(codeErr).to.equal(expectedCodeErr);
            expect(msgErr).to.equal(expectedMsgErr);
        });
    });

    it("T 1.2 : Connexion au compte inexistant ", () => {
        const body = {
            email: "kidou@test.fr",
            password: "qwerty"
        };
        return axios.post(`${URL}/user/sign_in`, body)
            .catch(error => {
                const codeErr = error.response.status;
                const msgErr = error.response.data.message;
                const expectedCodeErr = 400;
                const expectedMsgErr = 'User unknown';

                expect(codeErr).to.equal(expectedCodeErr);
                expect(msgErr).to.equal(expectedMsgErr);
            })
    });

    it("T 1.3 : Création nouveau compte (utilisateur1) ", () => {
        const body = {
            email: "k01@test.fr",
            username: "k01",
            phone: "0606060606",
            password: "qwerty"
        }
        return axios.post(`${URL}/user/sign_up`, body)
            .then(response => {
                token1 = response.data.token
                const code = response.status;
                const expectedCode = 200;
                expect(code).to.equal(expectedCode);
            })
            .catch(error => {
                console.log(error);
            });
    });

    it("T 1.4 : Création compte existant", () => {
        const body = {
            email: "k01@test.fr",
            username: "k01",
            phone: "0606060606",
            password: "qwerty"
        };
        return axios.post(`${URL}/user/sign_up`, body)
            .catch(error => {
                const codeErr = error.response.status;
                const expectedCodeErr = 400;
                const msgErr = error.response.data.message;
                const expectedMsgErr = "Email already exists";

                expect(codeErr).to.equal(expectedCodeErr);
                expect(msgErr).to.equal(expectedMsgErr);
            })
    });

    it("T 1.5 : Connexion avec l'utilisateur1 ", () => {
        const body = {
            email: "k01@test.fr",
            password: "qwerty"
        };
        return axios.post(`${URL}/user/sign_in`, body)
            .then(response => {
                const code = response.status;
                token1 = response.data.token;
                const expectedCode = 200;
                const expectedTokenVoid = "";

                expect(code).to.equal(expectedCode);
                expect(token1).to.not.equal(expectedTokenVoid);
            })
            .catch(error => {
                console.log(error);
            });
    });


    it("T 1.6 : Création d'une nouvelle annonce ", () => {
        const formData = new FormData();
        formData.append('title', 'Voiture electrique pour enfant');
        formData.append('description', 'Belle voiture en très bon état');
        formData.append('price', '110');
        formData.append('picture', fs.createReadStream('C:/Users/abdel/Desktop/Photo/voiture.jpg'));

        return axios({
            method: 'post',
            url: `${URL}/offer/publish`,
            data: formData,
            headers: { ...formData.getHeaders(), 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token1}` }
        })
            .then(response => {
                const code = response.status;
                id = response.data._id;
                const title = response.data.title;
                const price = response.data.price;

                const expectedCode = 200;
                const expectedIdVoid = "";
                const expectedTitle = "Voiture electrique pour enfant";
                const expectedPrice = 110;

                expect(code).to.equal(expectedCode);
                expect(id).to.not.equal(expectedIdVoid);
                expect(title).to.equal(expectedTitle);
                expect(price).to.equal(expectedPrice);
            })
            .catch(error => {
                console.log(error);
            });
    });
});


describe("Test 2 : Modification d'une annonce", () => {

    it("T 2.1 : modifier prix d une annonce par son utilisateur", () => {
        const formData = new FormData();
        formData.append('price', '105');

        return axios({
            method: 'put',
            url: `${URL}/offer/update/${id}`,
            data: formData,
            headers: { ...formData.getHeaders(), 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token1}` }
        })
            .then(response => {
                const code = response.status;
                const msg = response.data.message;
                const expectedCode = 200;
                const expectedMsg = "Offer updated";

                expect(code).to.equal(expectedCode);
                expect(msg).to.equal(expectedMsg)
            })
            .catch(error => {
                console.log(error);
            })
    });

    it(" T 2.2 : Création d'un nouvel utilisateur (utilisateur2", () => {
        const body = {
            email: "k02@test.fr",
            username: "k02",
            phone: "0606060606",
            password: "qwerty"
        };
        return axios.post(`${URL}/user/sign_up`, body)
            .then(response => {
                token2 = response.data.token;

                const code = response.status;
                const expectedCode = 200;
                expect(code).to.equal(expectedCode);
            })
            .catch(error => {
                console.log(error);
            });
    });

    it("T 2.3 : Connexion avec l'utilisateur2", () => {
        const body = {
            email: "k02@test.fr",
            password: "qwerty"
        }
        return axios.post(`${URL}/user/sign_in`, body)
            .then(response => {
                const code = response.status;
                const expectedCode = 200;
                token2 = response.data.token;
                const expectedToken = "";

                expect(code).to.equal(expectedCode);
                expect(token2).to.not.equal(expectedToken);
            })
            .catch(error => {
                console.log(error);
            });
    });

    it("T 2.4 : modifier une annonce d'un autre utilisateur", () => {
        const formData = new FormData();
        formData.append('price', '59');

        return axios({
            method: 'put',
            url: `${URL}/offer/update/${id}`,
            data: formData,
            headers: { ...formData.getHeaders(), 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token2}` }
        })
            .catch(error => {
                const code = error.response.status;
                const msgErr = error.response.data.message;
                const expectedCode = 401;
                const expectedMsgErr = "Unauthorized";

                expect(code).to.equal(expectedCode);
                expect(msgErr).to.equal(expectedMsgErr)
            });
    });
});


describe("T 3 : Consultation et paiement", () => {

    it("T 3.1 : Consultation d'une annonce", () => {
        return axios.get(`${URL}/offer/${id}`)
            .then(response => {
                const code = response.status;
                const expectedCode = 200;
                expect(code).to.equal(expectedCode);
            })
            .catch(error => {
                console.log(error)
            });
    });

    const data = {
        stripeToken: "tok_visa",
        amount: 1000,
        description: "test",
        offers: [`${id}`]
    };

    it("T 3.2 Paiement", () => {
        return axios({
            method: 'post',
            url: `${URL}/pay`,
            headers: { 'Authorization': `Bearer ${token2}` },
            data: data
        })
            .then(response => {
                
                const code = response.status
                const expectedCode = 200;
                const confirming = response.data.paid;
                const expectedConfirming = true;

                expect(code).to.equal(expectedCode);
                expect(confirming).to.equal(expectedConfirming);
            })
            .catch(error => {
                console.log("error T 3.2 paiement");
                console.log(error);
                console.log("CodeStatus : "+error.response.status);
                console.log("StatusText : "+error.response.statusText);
                
                const code = response.status
                const expectedCode = 200;
                const confirming = response.data.paid;
                const expectedConfirming = true;

                expect(code).to.equal(expectedCode);
                expect(confirming).to.equal(expectedConfirming);

            });
    });

});

describe("T 4 : Suppression d'une annonce", () => {

    it("T 4.1 Suppression annonce de l'utilisateur1 par l'utilisateur2", () => {
        return axios({
            method: 'delete',
            url: `${URL}/offer/delete/${id}`,
            headers: { 'Authorization': `Bearer ${token2}` }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                const codeErr = error.response.status;
                const msgErr = error.response.data.message;
                const expectedCodeErr = 401;
                const expectedMsgErr = "Unauthorized";

                expect(codeErr).to.equal(expectedCodeErr);
                expect(msgErr).to.equal(expectedMsgErr);
            });
    });

    it("T 4.2 Suppression annonce par son utilisateur1", () => {
        return axios({
            method: 'delete',
            url: `${URL}/offer/delete/${id}`,
            headers: { Authorization: `Bearer ${token1}` }
        })
            .then(response => {
                const code = response.status;
                const expectedCode = 200;
                const msg = response.data["payload"].message;
                const expectedMsg = "Offer deleted";

                expect(code).to.equal(expectedCode);
                expect(msg).to.equal(expectedMsg);
            })
            .catch(response => {
                console.log(response);
            });
    });

    it("T 4.3 Consultation d'une annonce supprimée", () => {
        return axios.get(`${URL}/offer/${id}`)
            .catch(error => {
                const codeErr = error.response.status;
                const expectedCodeErr = 400;
                const msgErr = error.response.data.message;
                const expectedMsgErr = "No offer found";

                expect(msgErr).to.equal(expectedMsgErr);
            })
            .catch(response => {
                console.log(response);
            });
    });
});
