import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { AuthorizedUser } from 'src/user/user.dto';
import { CreateItemDto } from './dto/item.dto';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get('get-all')
  getAllItems() {
    return this.itemService.getAllItems();
  }

  @Post('create')
  createItem(@Body() data: CreateItemDto, @CurrentUser() user: AuthorizedUser) {
    return this.itemService.createItem(data, user.id);
  }
}
