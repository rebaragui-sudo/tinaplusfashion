-- SQL para inserir o produto DUPLA FACE ANIMAL PRINT
-- Execute este script no SQL Editor do Supabase (menu "SQL Editor" no dashboard)

-- Primeiro, insere o produto
INSERT INTO products (name, description, price, image_url, images, category, is_featured, is_new_arrival, colors, sizes)
VALUES (
  'DUPLA FACE ANIMAL PRINT',
  'Dupla face um lado animal print outro lado liso. Veste até GG.',
  95.00,
  '/dupla-face-animal-print.jpeg',
  '{}',
  'Blusas',
  false,
  true,
  ARRAY['Animal Print:estampa:/dupla-face-animal-print.jpeg'],
  ARRAY['P', 'M', 'G', 'GG']
);

-- Pega o ID do produto recém-inserido
WITH new_product AS (
  SELECT id FROM products WHERE name = 'DUPLA FACE ANIMAL PRINT' LIMIT 1
)
-- Insere as variantes (estoque) para cada combinação de cor e tamanho
INSERT INTO product_variants (product_id, color, size, stock)
SELECT
  np.id,
  'Animal Print:estampa:/dupla-face-animal-print.jpeg',
  s.size,
  5
FROM new_product np
CROSS JOIN (
  SELECT unnest(ARRAY['P', 'M', 'G', 'GG']) AS size
) s;