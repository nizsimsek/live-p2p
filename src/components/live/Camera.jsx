const Camera = ({ user }) => {
  return (
    <div className="flex w-auto h-auto m-auto max-w-xs">
      <div className="w-full h-full relative">
        <img
          src={user?.avatar}
          alt={user?.firstName + " " + user?.lastName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 w-full px-4">
          <div className="w-full h-auto bg-black bg-opacity-60 rounded-full px-2 text-center">
            <span className="text-white font-bold">
              {user?.firstName + " " + user?.lastName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
