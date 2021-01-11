import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Transformer, Image } from 'react-konva';
import useImage from 'use-image';

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const [image] = useImage(shapeProps?.imageURL);
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        onClick={onSelect}
        image={image}
        ref={shapeRef}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={e => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          keepRatio
          borderStroke="#EA2663"
          anchorFill="#EA2663"
          anchorStroke="#EA2663"
          anchorCornerRadius={4}
          anchorSize={8}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const initialItems = [
  {
    x: 20,
    y: 20,
    width: 50,
    height: 50,
    id: 1,
    imageURL: 'https://www.datocms-assets.com/21735/1580398225-418-pink-8x.png',
  },
  {
    width: 150,
    height: 150,
    id: 2,
    imageURL: 'https://www.datocms-assets.com/22029/1581155473-cryptoshark.png',
    x: 300,
    y: 500,
  },
];

const App = () => {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState();
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={e => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
          setSelectedId(null);
        }
      }}
      onTouchStart={() => setSelectedId()}
    >
      <Layer>
        {items.map(item => (
          <Rectangle
            shapeProps={item}
            key={item?.id}
            onSelect={() => {
              setSelectedId(item?.id);
            }}
            isSelected={item?.id === selectedId}
            onChange={newAttrs => {
              setItems(
                items.map(item =>
                  item?.id === newAttrs?.id ? newAttrs : item,
                ),
              );
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default App;
