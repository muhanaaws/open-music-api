const mapAlbumsDBToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
  cover,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  coverUrl: cover,
});

const mapSongsDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  created_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapAlbumsDBToModel, mapSongsDBToModel };