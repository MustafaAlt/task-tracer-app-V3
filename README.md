<h1>Proje Adı: Task Tracker Uygulaması</h1>
Bu proje, görevlerinizi etkili bir şekilde yönetmenizi sağlayan bir Task Tracker uygulamasıdır. Kullanıcı kimlik doğrulama, görev ekleme, düzenleme ve silme gibi temel özelliklere sahiptir.

<img width="1108" height="601" alt="image" src="https://github.com/user-attachments/assets/a1d74687-0d40-45a8-8f7e-58ced51aca54" />

JSON Web Token (JWT) ile Kimlik Doğrulama Nasıl Çalışır?
Görselde gördüğünüz süreç, modern bir uygulamanın JSON Web Token (JWT) kullanarak kullanıcı kimlik doğrulamasını nasıl gerçekleştirdiğini gösteriyor. Bu yöntem, güvenli ve verimli olduğu için yaygın olarak kullanılıyor.

Sürecin Adımları
Kayıt veya Giriş Yapma: İlk adımda, kullanıcı username ve password bilgilerini sunucuya bir POST isteği ile gönderir. Görselde bu işlem /api/auth/register endpoint'i üzerinden yapılıyor.

JWT Oluşturma: Sunucu, gelen kullanıcı bilgilerini doğruladıktan sonra, kullanıcıya özel bir JWT oluşturur. Bu token, kullanıcının kimliğini doğrulamak için gerekli bilgileri (örneğin, kullanıcı kimliği veya rolü) içerir.
Görselde gördüğünüz token, Access Token'dır.

JWT tabanlı kimlik doğrulama sistemlerinde temel akış şöyledir:

Kullanıcı giriş yaptığında, sunucu bir Access Token oluşturur ve bu token'ı istemciye gönderir.

İstemci, korunan kaynaklara erişmek için bu Access Token'ı her istekte HTTP başlığına ekleyerek gönderir.

Access Token'ın geçerlilik süresi genellikle kısadır (örneğin 15 dakika veya 1 saat).

Refresh Token ise genellikle daha uzun ömürlüdür. Access Token'ın süresi dolduğunda, istemci bu Refresh Token'ı kullanarak yeni bir Access Token almak için sunucuya bir istek gönderir. 


<img width="1122" height="715" alt="{8E57657C-6C07-4A5F-8089-CF412CADA9BF}" src="https://github.com/user-attachments/assets/e3773e20-be1e-400d-8d63-6eb0582d8642" />

Görseldeki durumun açıklaması şöyle:

POST /api/auth/login: Bu, bir önceki görseldeki kayıt (register) işleminden sonraki adım. Genellikle bir kullanıcının sisteme giriş yaptığı veya süresi dolmuş bir token'ı yenilediği endpoint'tir.

Authorization Sekmesi: Postman'de bu sekmeyi kullanarak, isteğin HTTP başlığına (header) kimlik doğrulama bilgisini ekliyorsun. Bu, sunucunun seni tanıması için gerekli.

Auth Type -> Bearer Token: Bu, modern API'lerde token göndermenin en yaygın yöntemidir. Anlamı şudur: "Ben bu token'ı taşıyorum ve bu token'ın bana ait olduğunu iddia ediyorum." Token, "taşıyıcı" (bearer) olarak adlandırılır çünkü ona sahip olan herkes tarafından kullanılabilir.
<img width="1100" height="585" alt="{EC6323E0-A056-4508-8994-FC1CCBF530CD}" src="https://github.com/user-attachments/assets/39d672cb-2cfa-44d1-8ccf-a4ed1bfa13ce" />
İlk Görsel: Sen POST /api/auth/register (kayıt) veya POST /api/auth/login (giriş) endpoint'ine kullanıcı adı ve şifre gönderiyorsun. Sunucu sana bir Access Token dönüyor. Bu, kimliğini doğrulayan ilk token'ın.

İkinci Görsel: Bu görsellerde POST /api/auth/login endpoint'ini tekrar kullanıyorsun, ancak bu sefer Authorization: Bearer <token> başlığı ile. Yani, önceki adımda aldığın Access Token'ı göndererek yeni bir token istiyorsun. Sunucu da sana tekrar yeni bir Access Token dönüyor.

<img width="1130" height="904" alt="{B9149127-5122-463A-875E-82B11240A437}" src="https://github.com/user-attachments/assets/8ce072cf-6e1c-44c3-b4c1-db939e3294fe" />
Bu görsel için de kısa ve net bir açıklama hazırladım. Bu açıklama, API'nin temel bir işlevini, yani yeni bir kaynak oluşturmayı nasıl gerçekleştirdiğini gösteriyor.


Yetkilendirme ile Kaynak Oluşturma (POST)
Bu görsel, başarılı bir kimlik doğrulamasından sonra korunan bir API endpoint'ine nasıl veri gönderileceğini gösteriyor. JWT ile yetkilendirilmiş bir kullanıcının yeni bir görev (task) oluşturma sürecini ele alıyor.

Süreç:
aldığımız token authorizaten kısmına aynı şekilde eklendikten sonra bu işlem başarıya ulaşıyor.

POST İsteği: /api/tasks endpoint'ine POST metoduyla bir istek gönderiliyor. Bu metot, genellikle sunucuda yeni bir kaynak oluşturmak için kullanılır.

JSON Gövdesi (Request Body): İsteğin gövdesinde (Body sekmesi), oluşturulacak görevin detayları (title, description, status) JSON formatında gönderiliyor.

Başarılı Yanıt (200 OK): Sunucu, isteği başarılı bir şekilde işledikten sonra 200 OK durum kodunu dönüyor. Yanıtın gövdesinde ise oluşturulan yeni göreve ait tüm detaylar (id, owner, due_date, vb.) yer alıyor.
<img width="1122" height="877" alt="image" src="https://github.com/user-attachments/assets/9c08f6b7-1954-4cc5-8a03-2015ba2b8dbb" />
en son bu tokenı aynı şekilde koyduktan sonra get metodu ile tüm görevleri listeletebiliyoruz. 




<h1> REFRESH TOKEN EKLENDİ :</h1>
<img width="1121" height="730" alt="{CE4AF08D-4217-4370-BB70-ACB6FB0B6A79}" src="https://github.com/user-attachments/assets/9a509ca6-bb26-4348-be11-74dd39e25adc" />
mantık aynı aslında refresh token döndük kullanıcının acces tokenının süresi bitince refresh tokena istek atar ve tekrar bir acces token alır. oaly bu aslında. 


<img width="1138" height="675" alt="{648CFB51-8BA2-4A69-9E6A-8BFF1715F095}" src="https://github.com/user-attachments/assets/e66f71be-33cb-4655-b311-6468866d8cde" />                                              <img width="1106" height="627" alt="{CB6A1E95-4131-4CB5-B16F-5A416E750669}" src="https://github.com/user-attachments/assets/0e1c7b88-cad7-4c01-ade1-f01d02ed46f5" />
bu şekilde refresh token ile istek attıktan sonra tekrar acces token almış oluyoruz. 





















