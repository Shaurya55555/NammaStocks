import asyncio
from src.database import async_session
from src.auth.repository import upsert_user
from src.auth.models import User

async def main():
    async with async_session() as session:
        try:
            # Recreate exactly what upsert_user does
            user = await upsert_user(
                session=session,
                clerk_user_id="clerk_123",
                email="test@clerk.com",
                name="Clerk Test",
                first_name="Clerk",
                last_name="Test"
            )
            print("User upserted!", user)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
