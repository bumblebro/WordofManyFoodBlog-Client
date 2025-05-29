import mealtypes from "../libs/MealTypes/MealTypes";

function FoodSections() {
  return (
    <div className="text-black mt-72">
      {mealtypes.map((e, i) => (
        <div key={i}>
          <h1>{e.name}</h1>
          <img src={e.url} alt="" />
        </div>
      ))}
    </div>
  );
}

export default FoodSections;
