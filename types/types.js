import entity, { toString as entityToString } from './entity';

toString(context, value) {
  switch (value.type) {
  case entity.type:
    return entityToString(context, value);
  }
}
