import { useCollections, useWords } from "~assets/storage/collections";
import WordsTable from "~popup/WordsTable"

import "~assets/styles/normalize.css";
import "~assets/styles/bootstrap.min.css";
import "./style.scss"

function LearnGround() {
  const { words } = useWords();
  const { collections } = useCollections();

  return (
    <div className="learnground container-fluid vh-100 d-flex flex-column">
      <div className="header p-3 border-bottom">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="fs-2 m-0">LearnGround</h1>
        </div>
      </div>

      <div className="content flex-grow-1 p-4">
        <div className="row h-100">
          <div className="col-12">
            {Object.keys(words).length > 0 ? (
              Object.values(collections)
                .sort((a, b) => a.order - b.order)
                .map((collection) => {
                  const collectionWords = Object.values(words).filter((word) =>
                    word.collectionIds.includes(collection.id)
                  );

                  if (collectionWords.length === 0) return;
                  const sortedCollectionWords = collectionWords.sort(
                    (a, b) => b.priority - a.priority
                  );
                  return (
                    <WordsTable
                      key={collection.id}
                      collection={collection}
                      collectionWords={sortedCollectionWords}
                    />
                  );
                })
            ) : (
              <p className="text p-0"> You don't have added words yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnGround;
