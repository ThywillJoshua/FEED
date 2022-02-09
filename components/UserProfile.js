import Image from "next/image";

export default function UserProfile({ user }) {
  if (!user) return <></>;

  return (
    <div className="box-center">
      <div className="card-img-center">
        <Image
          src={user.photoURL || "/user"}
          alt="user"
          width={100}
          height={100}
          //   className="img"
        />
      </div>

      <p>
        <i>@{user.username}</i>
      </p>

      <h1>{user.displayName}</h1>
    </div>
  );
}
