"""
seed_documents.py
Them du lieu mau vao collection 'documents' de test chatbot.
Chay: cd bot && python seed_documents.py
"""

from pymongo import MongoClient
from config import MONGO_URI

SAMPLE_DOCUMENTS = [
    {
        "document_id": "guide_chon_guitar",
        "title": "Guitar phu hop cho nguoi moi - Rosen G12",
        "type": "product_guide",
        "content": """Guitar phu hop cho nguoi moi hoc - Rosen G12

Nguoi moi nen hoc guitar Rosen G12 vi day la dong guitar gia re, phu hop cho nguoi bat dau.

Thong so ky thuat Rosen G12:
- Loai: Guitar Acoustic (danh day kim loai)
- Kich thuoc: 41 inch (Full size)
- Go than: Go soi (Spruce)
- Go matlung: Go phong (Phong wood)
- Can dan: Go phong, co kich thuoc phu hop tay nguoi Viet
- Day dan: Day kim loai (co the thay day nilon neu muon)
- Action (khoang cach day va can): Thap, de bam tay
- Dieu chinh: Co the dieu chinh action tai cua hang
- Gioi han do tuoi: Tu 12 tuoi tro len
- Mau sac: Tu nhien (natural wood finish)

Gia ban: 2.300.000d

Uu diem cho nguoi moi:
- Gia re, phu hop hoc sinh, sinh vien
- Action thap, bam khong bi dau tay
- Chat luong on dinh, do ben cao
- Am thanh tu nhien, sang rot
- De dieu chinh va bao tri

Nguoi moi chi can mua Rosen G12 la du de bat dau hoc. Den cua hang Nam Acoustic Guitar Shop de thu truoc khi mua.""",
        "status": "active",
    },
    {
        "document_id": "faq_thanh_toan",
        "title": "FAQ - Thanh toan va giao hang",
        "type": "faq",
        "content": """Cau hoi thuong gap ve thanh toan va giao hang

1. Cua hang ho tro nhung hinh thuc thanh toan nao?
Cua hang ho tro thanh toan khi nhan hang (COD) va chuyen khoan ngan hang. Ngoai ra con ho tro tra gop qua the tin dung va vi dien tu.

2. Phi giao hang la bao nhieu?
- Don tu 500.000d: Mien phi giao hang toan quoc.
- Don duoi 500.000d: Phi ship 30.000d - 50.000d tuy khu vuc.
- Noi thanh Ha Noi/HCM: 30.000d.
- Tinh thanh khac: 40.000d - 50.000d.

3. Thoi gian giao hang?
- Noi thanh Ha Noi/HCM: 1-2 ngay lam viec.
- Tinh thanh khac: 3-5 ngay lam viec.
- Dat truoc 14h se xu ly trong ngay.

4. Co the kiem tra hang truoc khi thanh toan khong?
Co, khach hang duoc kiem tra hang truoc khi thanh toan. Neu san pham bi huong do van chuyen, vui long tu choi nhan hang va lien he cua hang.

5. Lam sao theo doi don hang?
Ma van don se duoc gui qua SMS/email sau khi xu ly. Ban co the theo doi trong muc Tai khoan > Don hang tren trang web.""",
        "status": "active",
    },
    {
        "document_id": "policy_baohanh",
        "title": "Chinh sach bao hanh san pham",
        "type": "policy",
        "content": """Chinh sach bao hanh - Nam Acoustic Guitar Shop

1. Thoi gian bao hanh:
Tat ca san pham duoc bao hanh 12 thang ke tu ngay mua hang. Thoi gian bao hanh duoc ghi ro tren hoa don mua hang.

2. Pham vi bao hanh:
- Bao hanh mien phi cho cac loi do nha san xuat: loi keo, moi noi, can dan, phim dan.
- Bao hanh pickup, tuner va cac phu kien dien tu di kem.

3. Dieu kien bao hanh:
- San pham con trong thoi gian bao hanh.
- Co hoa don mua hang hoac chung tu mua hang hop le.
- San pham bi huong do loi nha san xuat, khong phai do su dung sai cach.

4. Truong hop khong bao hanh:
- Huong do roi, va dap, ngem nuoc, chay no.
- San pham da qua sua chua khong dung quy trinh.
- Huong do thien tai, hoa hoan.
- San pham khong co hoa don hoac het han bao hanh.

5. Quy trinh bao hanh:
- Lien he cua hang qua hotline hoac trang Lien he.
- Gui san pham kem hoa don mua hang.
- Cua hang kiem tra va thong bao thoi gian sua chua (thuong 3-7 ngay).
- San pham duoc sua chua hoac the the mien phi neu thuoc pham vi bao hanh.""",
        "status": "active",
    },
    {
        "document_id": "guide_cham_soc_guitar",
        "title": "Huong dan cham soc va bao quan guitar acoustic",
        "type": "manual",
        "content": """Huong dan chi tiet cach bao quan guitar acoustic

1. Moi truong luu tru:
- De guitar o noi kho thoang mat, tranh anh sang truc tiep va nguon nhiet.
- Nhiet do ly tuong: 20-25 do C, do am 45-55%.
- Tranh de guitar trong xe hoi noi hoac noi co nhiet do thay doi dot ngot.
- Khong de gan dieu hoa, may lanh hoac cua so tiep truc voi nang.

2. Ve sinh guitar:
- Sau moi lan choi, lau than guitar bang khan mem kho de loai bo muoi va mo hoi.
- Dung khan am nhe de lau can guitar, tranh de nuoc vao lo sound hole.
- Khong dung hoa chat manh hay chat tay ran de ve sinh.
- Dung chi dam vao phan day de loai bo vet ban.

3. Bao quan day guitar:
- Ve sinh day bang khan mem sau moi lan choi.
- Thay day dinh ky 2-3 thang (tuy tan suat choi).
- Khi cat guitar, nen noi long day mot chut de giam luc len can va than.

4. Bao quan khi khong su dung:
- Cho guitar vao case (vali cung) hoac gig bag (tui vai).
- De silica gel trong case de hut am, tranh am muc.
- Neu de lau khong choi (tuan tro len), nen thao day hoac noi long het.

5. Kiem tra dinh ky:
- Dinh ky 1 thang kiem tra can guitar xem bi cong khong.
- Kiem tra nut (_bridge) co bi rot khoi than dan khong.
- Kiem tra phim dan (_fret) co bi lung khong.

6. Meo hay:
- Khi khong choi, nen de guitar o vi tri thang dung hoac treo tren gia.
- Tranh de guitar noi co khoi thuoc, vi khoi bam vao go se anh huong am thanh.
- Neu song o mien bac, vao mua am can dat them may hut am de dam bao do am phu hop.""",
        "status": "active",
    },
    {
        "document_id": "guide_piano_vs_organ",
        "title": "Phan biet Piano dien va Organ",
        "type": "product_guide",
        "content": """Phan biet Piano dien va Organ (nhac cu keyboard)

1. Piano dien (Digital Piano):
- Ban phim 88 phim co do nang (weighted keys), mo phong ban phim dan piano co.
- Am thanh mo phong dan piano acoustich that su.
- Phu hop hoc piano nghiem tuc, choi classical, jazz, pop.
- Co the co pedal (dam) nhu piano that.
- Gia tu 5.000.000d den 50.000.000d.
- Vi du: Yamaha P-125, Casio CDP-S100, Roland FP-30X.

2. Organ (nhac cu keyboard):
- Ban phim nho hon (61 phim), khong co do nang (unweighted/semi-weighted).
- Co nhieu giong dan (sounds) va rhythms tu dong dam chords.
- De hoc hon, phu hop choi giai tri, hat karaoke.
- Co the tu dong phu am khi bam chords.
- Gia tu 2.000.000d den 15.000.000d.
- Vi du: Yamaha PSR-E383, Yamaha PSR-SX700, Casio CT-X9000IN.

3. Nen chon loai nao?
- Muon hoc piano nghiem tuc: Chon piano dien (88 phim weighted).
- Muon choi giai tri, de hoc: Chon organ (61 phim, co rhythms).
- Neu moi bat dau va chac chan hoc lau dai: Piano dien la lua chon tot nhat.
- Neu muon nguoi trong gia dinh cung choi duoc: Organ phu hon vi de lam quen.

4. Giai doan:
- Piano dien gia re tu 5tr (Yamaha P-45, Casio CDP-S100).
- Organ gia re tu 2tr (Yamaha PSR-E383, Casio CT-X870IN).
- Ca hai deu co the ket noi voi may tinh de hoc online.""",
        "status": "active",
    },
]


def main():
    print("=" * 50)
    print("SEED DOCUMENTS - Guitar Shop RAG")
    print("=" * 50)

    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client.get_database()
        collection = db["documents"]

        existing = collection.count_documents({})
        print(f"\nDocuments hien tai trong DB: {existing}")

        inserted = 0
        for doc in SAMPLE_DOCUMENTS:
            exists = collection.find_one({"document_id": doc["document_id"]})
            if exists:
                collection.update_one(
                    {"document_id": doc["document_id"]},
                    {"$set": {"content": doc["content"], "title": doc["title"]}}
                )
                print(f"  [UPDATE] {doc['document_id']} - {doc['title']}")
            else:
                collection.insert_one(doc)
                print(f"  [INSERT] {doc['document_id']} - {doc['title']}")
                inserted += 1

        print(f"\nHoan thanh! Da them {inserted} tai lieu moi.")
        print(f"Tong so documents: {collection.count_documents({})}")
        print("\nTiep theo, chay: python indexer.py de index cho chatbot.")

    except Exception as e:
        print(f"Loi: {e}")
    finally:
        if client:
            client.close()


if __name__ == "__main__":
    main()
