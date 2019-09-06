# CAM by API

This lab will walk you through using the CAM Rest API and how you can use Postman collections and environments to test functions of the API.

This lab will be ran on the **boot** node - login as sysadmin (passw0rd)

## Install Postman extension in the Chrome web browser

You can install the Postman extension using this link: 
    https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop

To install Postman, just click the button "Add to Chrome"

When Chrome is opened, you can access to your applications (extensions) entering `chrome://apps` in your Chrome address bar.  

Click the `Postman` icon to open Postman application.  A window warns you that this chrome app is being deprecated. Do not download the native application. Just close the window to ignore this warning message. 


## Generating Token with cURL

To generate an access token, open a terminal and run the following command

```
curl -k -X POST https://10.10.1.2:8443/idprovider/v1/auth/identitytoken -d 'grant_type=password&username=admin&password=passw0rd&scope=openid'
```

response:
``` 
{
    "access_token": "2e418d6dd198e10b0693b47e50a0895d18fbbeaa9776962dbca0f251218f8dd42627801f788f4f5a724ffe25cb8704d4033edbe01be107bdff9bba0d503d5b649502bf684e8aad424b0d4429a0f3c15f30c5658afe782ebc58f018ad4af4a9b8b4830dfbaf2f715cf136be25890401d5a6fdc6f57d05a5b79fa48711d7685d6f1d45ea7d4c4b523a81a8644b7630de32a9a0d6aa4f23a727ddbb309fd343d22608a0f71961ca896ba97ab0df539f9601912c307dbd354d2b136e2c28871273a33975e937347994997f17e946f6deef0ab2e4568d4093b634a0cc98e2670a6b447177a030aa40fb416af3702afa3a53780d7f5b11b1cc989376b1e5915fef8830590966e9f3352f4c6998cb9df44f0cb60dc588922ff9db43cf10d7e9499cec0b8ea77522e0598f8566690d6edbad3ea3a3d668eb4a7441c8e77d061694350e93e007f0035400a121900c1a7ba41807695f5cca7cd9143431e744fd1d27f261ac8b3df327e1fc6b93cda8f588cb2020ad42768f3871575b85d955680b72ef1e8796a29398c63da321248d69251adad878ab6c5e19767b4c034132e02563810cad70b4f49a9d6a0251806133487c2884e5c6e4d66ee4236b78874be66ea1e8eb762c243d00521bfe73a347a69bcdc556bcc4487de30d0b130794939ead0163c2174f4bcdd2c9475773ee51979c51273c1f96ac76e425cb312865566100ed90899d",
    "token_type": "Bearer",
    "expires_in": 43199,
    "scope": "openid",
    "refresh_token": "weOgYtLXDQylPIjbtAgacZliqhuChpGaYbCAdgYwdHXAOnx6jf",
    "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiOWJkMzdkN2QyZjA1Njc3OTdlNTlkMzQ1ODAzZjNjNDk3OGE0M2Q2YiIsInJlYWxtTmFtZSI6ImN1c3RvbVJlYWxtIiwidW5pcXVlU2VjdXJpdHlOYW1lIjoiYWRtaW4iLCJpc3MiOiJodHRwczovL215Y2x1c3Rlci5pY3A6OTQ0My9vaWRjL2VuZHBvaW50L09QIiwiYXVkIjoiZmE5OGEzYzRmNmFjMTBjMGM3Yjk3YjhlYzYxMzc0ODUiLCJleHAiOjE1NTc3ODc4MTksImlhdCI6MTU1Nzc1OTAxOSwic3ViIjoiYWRtaW4iLCJ0ZWFtUm9sZU1hcHBpbmdzIjpbXX0.T_W3jyW3xH-jwwOgsv0xIyjZTPI_58ezb9qZ7jjyygj7w8MsdYhfa914sHKFkzI7GcsZwsSC5i3N0irYrB33RQdWCO0BZgJ5VLXW8_aHVVkK3woKRab8OWsmV-9gtG-FYk4Sfp418c_8tSGNyC9BM3p83TdkE1bnOpP5UrPVFGKWvjMy_uWbAhSstX3NeLXL57WNZhbvZ-QNfQRl-tbJYgnr6Ifa0Vu7yVIaMxAF8b1gxSW6M3bWpr8WxXtUVNk7SOLSv1d_Dryxx8kKFzPwU5DKBuckXB6SArjQy4VCUUcct8yHraqE-p-ne-lvJ8lNV33t0NQ5W9Xcfg_GHU3Zlw"
}
```

Take note, the API responds with an `access_token` variable as well as an `expires_in` variable containing the amount of time for which the token is valid.

The `access_token` variable should be added as an authorization header in future API requests.

## Importing Postman Collection
A Postman collection *cam-api.postman_collection.json* has been prepared in the git repo.

You can import a json formatted file that contains individual requests. 

1. From the taskbar click Applications > Development > Postman.

1. Once Postman is open, click **Import** in the upper lefthand corner.

1. Select **choose files** and specify *cam-api.postman_collection.json*.

1. On the left sidebar a new collection should now exist called `cam-api`

1. Click on the collection and a list of requests will appear. Explore through each of the requests taking note the request type (GET, POST, DELETE) the url endpoint for the request.

![Lab_4-4_C](../images/Lab_4-4_C.png)

## Importing Postman Environment
Environments can be setup to make the collection more reusable.

Importing the environment file is the same as importing a collections. 

1. With Postman open, click **Import**.

1. Select **choose files** and specify *cam-api.postman_environment.json*.

Environments can be selected in the upper righthand of the UI. 

1. Click on the dropdown list and select CAM.

![Lab_4-4_A](../images/Lab_4-4_A.png)

Selecting the eye next to the dropdown allow you to see the initial and current environment and global variables.

![Lab_4-4_B](../images/Lab_4-4_B.png)

## Common Rest APIs Services

### Get an access token
As shown earlier using cURL, getting an access token is the first step to 
1. Click on the **Get Access Token** request.

1. Click on **Body** and inspect the input parameters.

    ![Lab_4-4_D](../images/Lab_4-4_D.png)

    Notice how Postman indicates variables using `{{  }}`.
    
    For example, `{{cam_username}}` corresponds to the environment variable we imported from *cam-api.postman_environment.json*.

1. Click on **Tests** and inspect see how response code should be `200` then a global variable `token` is being set from the `access_token` in the response.

1. Click **Send**.

1. Click on **Body** below the request.

1. Verify the response has an `access_token` and `expires_in` just as earlier when the request was made with cURL.

![Lab_4-4_E](../images/Lab_4-4_E.png)

1. Click on the test and verify the response code test passed.

1. Click on the eye icon next in the environment dropdown and see value is now set for global variable `token`


### Get Query Params

1. Click on the **Get Query Params** request.

1. Click on **Headers** and inspect the input headers.

    ![Lab_4-4_F](../images/Lab_4-4_F.png)

    Notice how in this request the global variable {{token}} is now be used that we set in the test of the previous request to get access token.

1. Click on **Tests** and inspect see how response code should be `200` then a global variable `tenant_id` is being set from the `id` in the response.

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response taking note of the `id` and list of `namespaces`.

1. Click on the test and verify the response code test passed.

1. Click on the eye icon next in the environment dropdown and see value is now set for global variable `tenant_id`.


### Get templates

1. Click on the **Get Templates** request.

1. Click on **Params** and inspect the Query Params being set to the global variable `{{tenant_id}}` and environment variable `{{icp_team}}` as shown in the **Get Query Params**.

    ![Lab_4-4_G](../images/Lab_4-4_G.png)

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response.

1. Click on the test and verify the response code test passed.


### Get VSphere Cloud Provider
1. Click on the **Get VSphere Cloud Provider** request.

1. Click on **Params** and inspect the new query param `filter` for `{"where": {"name": "VMware vSphere" }}`.

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response.

1. Click on the test and verify the response code test passed.

### Get the VSphere Cloud Connection

1. Click on the **Get List of Cloud Connections Filtered** request.

1. Click on **Params** and inspect the query param `filter` for `{"where": {"name": "Team{{lab_team_id}}_VMware" }}`

    No value is initially set for `{{lab_team_id}}` so this will need to be edited

1. Click on the eye icon next to the environment selection drop down.

1. Click **edit** in the row of **cam-api**

1. Edit the current value column for `{{lab_team_id}}` to match your team's assigned number.

![Lab_4-4_H](../images/Lab_4-4_H.png)

1. Click on **Tests** and inspect see how response code should be `200`, the connection should validate successfully, and a global environment variable is being set for `vsphere_connection`

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response.

1. Click on the test and verify the response code test passed. Click on the eye icon next to the environment variable drop down list and look to see there is now a global parameter called `vsphere_connection` with a current value.

### Get the template for SingleVirtualMachine from list of templates

1. Click on the **Get Template for Single VM** request.

1. Click on **Params** and inspect the new query param `filter` for `{"where": {"name": "SingleVirtualMachine" }}`.

1. Click on **Tests** and inspect see how response code should be `200` then a global variable `templateId` is being set.

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response.

1. Click on **Tests** and verify the response code test passed.



### Deploy the SingleVirtualMachine template
1. Click on the **Deploy Single VM Template** request.

1. Click on **Body** and inspect the payload for deploy single virtual machine request. Take note the `{{vsphere_connection}}` and `{{template_id}}` stored from *Get Cloud Connections Filtered* and *Get Template for Single VM* respectively.

1. Click on **Tests** and inspect see how response code should be `200` and a global environment variable is being set for `stackId`.

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response and 

1. Click on **Test** and verify the response code test passed. Click on the eye icon next to the environment variable drop down list and look to see there is now a global parameter called `stackId` with a current value.


### Get stack instance
1. Click on the **Get Stack Instance** request.

1. Click on **Body** and inspect the payload for deploy single virtual machine request. Take note the `{{stackId}}` stored from *Deploy Single VM Template*

1. Click on **Tests** and inspect see how response code should be `200`

1. Click **Send**.

1. Click on **Body** below the request. Inspect the response. 

1. Click on **Test** and verify the response code test passed. 

## Resources

CAM APIs and Examples, Hugh Hockett, (https://developer.ibm.com/cloudautomation/tutorials/cam-api-examples/)

Common Cloud Automation Manager APIs, Knowledge Center, (https://www.ibm.com/support/knowledgecenter/en/SS2L37_3.1.2.1/cam_common_API.html)
