import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User } from '../_models';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const users: User[] = [
            { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }
        ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate - public
            if (request.url.endsWith('/v1/auth/identitytoken') && request.method === 'POST') {
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: `fake-jwt-token`,
                    access_token: "c562753de30adf8d181f8bfec8c55bfb76c8d804a9ef10ba3c4231d6d435cbd5c729d9cb51b6c86068a28bf1f403a64f764b96c9dc752468513adf443bc7a497470aae9fbd8197674410218ec989ba2e0efa8e3e4e6ecf8014b458ff42191f09219337903dffed728a92e7be411c27657028b86493c131e574d4f377dfd5f264e895c62d6bc519f238e0de5e387937ff5f28e43915d6b3d44db4dc98ac3fcfae63ed3faf5658267471318781246fe42aeb0977817729c96a29118776360a244b48b7d120d8b9cef9394044e833862521e8228cd667c7a00733aa5b68e402b02272bd61bd53d6a79110fb902fe6286b9f0e0ec9d233722f63a6ab22aae99b16e6193af3c32f6e2f1d574da72e4369dcf7978841f7ea8fe942399672676d21b635b44045164994d01cb8d3e9ab6372122023fd5f03f081d0d554fb130fedfe4133bb3845e23fc16c012583e5475e185f5ab66673a2a8869ba42726459d0823f72715da16b3ae4e404e25d1639a67d6ddfce96ab02edd8b1cf45089d0505a4ffd1bbfa440e96d569052838f339fa3916511f1f3d48f4ed8317b8fbb31b23be7162e7ed5868d6d81b8fcc56e249279508a0cf78599c510f18a304d40c496ff02d0f6166ef6f1bab0e5e56a680b825d400021f3ba0f5909aaf90173309dab1c397c44c399e82c4418c98a0b3678274bc933c939c66a2461dcb271e2139450827c396b",
                    token_type: "Bearer",
                    expires_in: 43199,
                    scope: "openid",
                    refresh_token: "1bLQxNoS2LpaPtrIcVYQcONUKFm1h3a2QHAhUs0PwG4OtGIH5n",
                    id_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZjM2MGNhNDI1ZTIzZGViMjhiYmUzZTE2Nzc0ODgxOTFlMTlmNmZhMyIsInJlYWxtTmFtZSI6ImN1c3RvbVJlYWxtIiwidW5pcXVlU2VjdXJpdHlOYW1lIjoiYWRtaW4iLCJpc3MiOiJodHRwczovL215Y2x1c3Rlci5pY3A6OTQ0My9vaWRjL2VuZHBvaW50L09QIiwiYXVkIjoiZmE5OGEzYzRmNmFjMTBjMGM3Yjk3YjhlYzYxMzc0ODUiLCJleHAiOjE1NTc1Mjg0NTcsImlhdCI6MTU1NzQ5OTY1Nywic3ViIjoiYWRtaW4iLCJ0ZWFtUm9sZU1hcHBpbmdzIjpbXX0.D0-X0VIfR9vWHvykrKPSeV5WO8EWULE1FgoYYJQlKCCkZNKMsJ4Y0JmTfPIFe2TVtOxzZn9VHq1v4CyFGfqt3ZHOk7b97R2cGxeGnav3hnFvJajifaudy4llscibr_ErqSPqf7Zh43ztSBmUoWHqgH5N3Lh4o3XlfYp8Zvq6keTnC9Ln2hFNbRw8ZN344vbT4NYPmGouANfAT20NvHXOGQVEQPMYHnD8a1n5ueUSQbK3vQ-OoFbRqixZqQKMv98BQymhyUtrYiOw6FlX7bI8PK_OIw8Y73QfIiZ8lH_Kq38NUHGhienxlclNOM26uBoGFo0K-Fi6yAyJsqKFabnQ0g"

                });
            }

            // get all users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (!isLoggedIn) return unauthorised();
                return ok(users);
            }

            // get templates
            if (request.url.endsWith('/cam/api/v1/templates/?tenantId=bec31954-8d6f-4bfc-bb08-ac1dfd387a71&ace_orgGuid=all') && request.method === 'GET') {
                return ok([

                    {
                        "description": "LAMP - A fully-integrated environment for full stack PHP web development.",
                        "name": "LAMP stack deployment on AWS",
                        "type": "prebuilt",
                        "manifest": {
                            "template_type": "Terraform",
                            "template_format": "HCL",
                            "template_provider": "Amazon EC2",
                            "template_source": {
                                "github": {
                                    "url": "https://github.com/IBM-CAMHub-Open/starterlibrary",
                                    "dir": "AWS/terraform/hcl/lamp",
                                    "token": "3389a5c659f1909d422d08260918ad8f0b738b48",
                                    "ref": "2.3"
                                }
                            }
                        },
                        "metadata": {
                            "displayName": "LAMP stack deployment",
                            "providerDisplayName": "IBM",
                            "longDescription": "Deploys a LAMP Stack (Linux, Apache, MySQL, PHP) in AWS providing a complete development environment. This deployment also deploys a simple sample application to validate the stack is operational.",
                            "bullets": [
                                {
                                    "title": "Clouds",
                                    "description": "Amazon Web Services (AWS)"
                                },
                                {
                                    "title": "Operating systems supported",
                                    "description": "AWS: Ubuntu 16.04 for Apache and PHP; Underlying operating system for database instance"
                                },
                                {
                                    "title": "Topology",
                                    "description": "AWS: 2 virtual machines: <ul class=\"unordered-list-style\"><li>Apache and PHP;</li><li>MySQL</li></ul>"
                                },
                                {
                                    "title": "Software deployed",
                                    "description": "<ol class=\"list-numbering\"><li>Apache: a secure, efficient and extensible open-source HTTP server</li><li>MySQL: a multithreaded, multi-user, SQL database management system (DBMS)</li><li>PHP: a server-side scripting language designed for web development</li></ol>"
                                },
                                {
                                    "title": "Default virtual machine settings",
                                    "description": "<ul><li>AWS:<ul style=\"margin-left: 20px;\"><li>Flavor:<ul style=\"margin-left: 20px;\"><li>MySQL: Size = db.t2.micro, Storage = 10GB</li><li>Front end: Size = t1.micro, Cores = 1, Memory = 1GB, Storage = EBS Only</li></ul></li><li>Network: Private IP - in 10.0.1.0/24, Public IP - Computed</li><li>Firewall:<ul style=\"margin-left: 20px;\"><li>MySQL:<ul style=\"margin-left: 20px;\"><li>Ingress - Only allows SSH, ICMP, TCP 3306 for all sources;</li><li>Egress - All</li></ul><li><li>Front end:<ul style=\"margin-left: 20px;\"><li>Ingress - Only allows SSH, ICMP, HTTP, TCP 3306, 8080, 9080 for all sources;</li><li>Egress - All</li></ul><li></ul></li></ul></li></ul>"
                                },
                                {
                                    "title": "Usage and special notes",
                                    "description": "<ol class=\"list-numbering\"><li>Downloads latest releases of software.</li><li>Deployment takes approximately 5 minutes to complete.</li><li>To access the application and virtual machines, please see the instructions in the output log.</li><li>More details of software can be found in <a href=\"https://httpd.apache.org/\">https://httpd.apache.org/</a>, <a href=\"https://www.mysql.com/\">https://www.mysql.com/</a> and <a href=\"https://secure.php.net/\">https://secure.php.net/</a>.</li></ol>"
                                }
                            ],
                            "featuredImageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_50.png",
                            "imageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_50.png",
                            "mediumImageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_32.png",
                            "smallImageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_24.png",
                            "documentationUrl": "https://console.stage1.ng.bluemix.net/docs/services/CloudAutomationManager/index.html",
                            "termsUrl": "http://www-03.ibm.com/software/sla/sladb.nsf/sla/bm-7448-01",
                            "media": [
                                {
                                    "type": "image",
                                    "thumbnailUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_1.png",
                                    "url": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_1_large.png",
                                    "caption": ""
                                },
                                {
                                    "type": "image",
                                    "thumbnailUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_2.png",
                                    "url": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_2_large.png",
                                    "caption": ""
                                }
                            ]
                        },
                        "created_at": "2019-05-02T13:44:20.780Z",
                        "id": "5ccaf4342d254700174fab3f",
                        "tenantId": "DEFAULT",
                        "default_template_version": "5ccaf4342d254700174fab40"
                    },
                    {
                        "description": "MEAN - A simple and scalable starting point for full stack JavaScript web development.",
                        "name": "MEAN stack deployment on AWS",
                        "type": "prebuilt",
                        "manifest": {
                            "template_type": "Terraform",
                            "template_format": "HCL",
                            "template_provider": "Amazon EC2",
                            "template_source": {
                                "github": {
                                    "url": "https://github.com/IBM-CAMHub-Open/starterlibrary",
                                    "dir": "AWS/terraform/hcl/meanstack",
                                    "token": "6ada42c85325394eb17c6082df0bfdbfea8207e9",
                                    "ref": "2.3"
                                }
                            }
                        },
                        "metadata": {
                            "displayName": "MEAN stack deployment",
                            "providerDisplayName": "IBM",
                            "longDescription": "Deploys a MEAN stack (Mongo, Express, Angular, Node) in AWS providing a complete development environment. This deployment also deploys a simple sample application to validate the stack is operational.",
                            "bullets": [
                                {
                                    "title": "Clouds",
                                    "description": "Amazon Web Services (AWS)"
                                },
                                {
                                    "title": "Operating systems supported",
                                    "description": "AWS: Ubuntu 16.04"
                                },
                                {
                                    "title": "Topology",
                                    "description": "AWS: 2 virtual machines: <ul class=\"unordered-list-style\"><li>Node.js, Angular.js, Express.js;</li><li>MongoDB</li></ul>"
                                },
                                {
                                    "title": "Software deployed",
                                    "description": "<ol class=\"list-numbering\"><li>MongoDB: a NoSQL database</li><li>Express.js: a web application framework that runs on Node.js</li><li>Angular.js: a JavaScript MVC framework that runs in browser JavaScript engines</li><li>Node.js: an execution environment for event-driven server-side and networking applications</li></ol>"
                                },
                                {
                                    "title": "Default virtual machine settings",
                                    "description": "<ul><li>AWS:<ul style=\"margin-left: 20px;\"><li>Flavor: Size = t2.medium,</li><li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cores = 2, Memory = 4GB, Storage = EBS Only</li><li>Network: Private IP - in 10.0.1.0/24, Public IP - Computed</li><li>Firewall:<ul style=\"margin-left: 20px;\"><li>Mongo:<ul style=\"margin-left: 20px;\"><li>Ingress - Only allows SSH and ICMP for all sources, and TCP 27017 for 10.0.1.0/24 only;</li><li>Egress - All</li></ul><li><li>Front end:<ul style=\"margin-left: 20px;\"><li>Ingress - Only allows SSH, ICMP, TCP 8443 for all sources;</li><li>Egress - All</li></ul><li></ul></li></ul></li></ul>"
                                },
                                {
                                    "title": "Usage and special notes",
                                    "description": "<ol class=\"list-numbering\"><li>Downloads latest releases of software.</li><li>Deployment takes approximately 5 minutes to complete.</li><li>To access the application and virtual machines, please see the instructions in the output log.</li><li>The sample application in this deployment is from the open source project <a href=\"https://github.com/meanjs/mean\">https://github.com/meanjs/mean</a> and more details can be found in <a href=\"http://mean.io/\">http://mean.io/</a>.</li></ol>"
                                }
                            ],
                            "featuredImageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_50.png",
                            "imageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_50.png",
                            "mediumImageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_32.png",
                            "smallImageUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/ic_patternengine_24.png",
                            "documentationUrl": "https://console.stage1.ng.bluemix.net/docs/services/CloudAutomationManager/index.html",
                            "termsUrl": "http://www-03.ibm.com/software/sla/sladb.nsf/sla/bm-7448-01",
                            "media": [
                                {
                                    "type": "image",
                                    "thumbnailUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_1.png",
                                    "url": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_1_large.png",
                                    "caption": ""
                                },
                                {
                                    "type": "image",
                                    "thumbnailUrl": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_2.png",
                                    "url": "https://ibmpatternengine-staticcontent-prod.eu-gb.mybluemix.net/screenshots_2_large.png",
                                    "caption": ""
                                }
                            ]
                        },
                        "created_at": "2019-05-02T13:44:21.572Z",
                        "id": "5ccaf4352d254700174fab41",
                        "tenantId": "DEFAULT",
                        "default_template_version": "5ccaf4352d254700174fab42"
                    }

                ]);
            }

            // pass through any requests not handled above
            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};