import asyncio
from src.database import async_session
from src.user_management.repository import get_or_create_profile, update_user_profile

async def main():
    async with async_session() as session:
        try:
            profile = await get_or_create_profile(session, 1)
            print("Profile created/fetched:", profile)
            
            profile = await update_user_profile(session, 1, watchlist=["TEST1", "TEST2"])
            print("Profile updated:", profile)
        except Exception as e:
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
