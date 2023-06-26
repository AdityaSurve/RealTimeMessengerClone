import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currenUser = await getCurrentUser();
    const body = await request.json();
    const { userID, isGroup, members, name } = body;
    if (!currenUser?.id || !currenUser?.email)
      return new NextResponse("Unauthorized", { status: 401 });
    if (isGroup && (!members || members.length < 2 || !name))
      return new NextResponse("Invalid Data", { status: 400 });
    if (isGroup) {
      const newConverstation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currenUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      return NextResponse.json(newConverstation);
    }
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currenUser.id, userID],
            },
          },
          {
            userIds: {
              equals: [userID, currenUser.id],
            },
          },
        ],
      },
    });
    const singleConversation = existingConversations[0];
    if (singleConversation) return NextResponse.json(singleConversation);

    const newConverstation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currenUser.id,
            },
            {
              id: userID,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    return NextResponse.json(newConverstation);
  } catch (err: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
