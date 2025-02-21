-- Önce tüm varyasyonları sil
DROP FUNCTION IF EXISTS add_mahalle_yorum(
  text, uuid, text, numeric, numeric, numeric, numeric, numeric, numeric
);
DROP FUNCTION IF EXISTS add_mahalle_yorum(
  text, uuid, text, smallint, smallint, smallint, smallint, smallint, smallint
);

-- Yeni fonksiyonu oluştur
CREATE OR REPLACE FUNCTION add_mahalle_yorum(
  mahalle_id bigint,
  kullanici_id uuid,
  yorum text,
  guvenlik integer,
  ulaşım integer,
  sessizlik integer,
  temizlik integer,
  sosyal_hayat integer,
  yesil_alan integer
)
RETURNS SETOF mahalle_puanlamalari
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO mahalle_puanlamalari (
    mahalle_id,
    kullanici_id,
    yorum,
    guvenlik,
    ulaşım,
    sessizlik,
    temizlik,
    sosyal_hayat,
    yesil_alan,
    created_at
  )
  VALUES (
    add_mahalle_yorum.mahalle_id,
    add_mahalle_yorum.kullanici_id,
    add_mahalle_yorum.yorum,
    add_mahalle_yorum.guvenlik,
    add_mahalle_yorum.ulaşım,
    add_mahalle_yorum.sessizlik,
    add_mahalle_yorum.temizlik,
    add_mahalle_yorum.sosyal_hayat,
    add_mahalle_yorum.yesil_alan,
    NOW()
  )
  RETURNING *;
END;
$$; 